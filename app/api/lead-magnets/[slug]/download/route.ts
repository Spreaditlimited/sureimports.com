import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { renderLeadMagnetPdfBuffer } from "@/lib/marketing/leadMagnetPdf"

interface LeadMagnetRow {
  pidMagnet: string
  pidBlog: string
  slug: string
  title: string
  description: string | null
  pdfJson: string | null
}

function safeJsonParse(value: string | null) {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function filenameFromSlug(slug: string) {
  return `${slug.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-") || "sureimports-guide"}.pdf`
}

async function ensureDownloadTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS blog_lead_magnets (
      id INT NOT NULL AUTO_INCREMENT,
      pidMagnet VARCHAR(80) NOT NULL,
      pidBlog VARCHAR(80) NOT NULL,
      blogSlug VARCHAR(500) NULL,
      slug VARCHAR(255) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      title VARCHAR(255) NOT NULL,
      offerHeadline VARCHAR(255) NULL,
      description TEXT NULL,
      buttonText VARCHAR(120) NULL,
      bulletsJson LONGTEXT NULL,
      emailSubject VARCHAR(255) NULL,
      deliveryMessage TEXT NULL,
      pdfJson LONGTEXT NULL,
      recommendedCta VARCHAR(120) NULL,
      sourceQuery VARCHAR(700) NULL,
      model VARCHAR(120) NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY blog_lead_magnets_pidMagnet_key (pidMagnet),
      UNIQUE KEY blog_lead_magnets_pidBlog_key (pidBlog),
      UNIQUE KEY blog_lead_magnets_slug_key (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS blog_lead_magnet_downloads (
      id INT NOT NULL AUTO_INCREMENT,
      pidDownload VARCHAR(80) NOT NULL,
      pidMagnet VARCHAR(80) NOT NULL,
      pidBlog VARCHAR(80) NULL,
      email VARCHAR(255) NULL,
      source VARCHAR(100) NULL,
      pageUrl TEXT NULL,
      createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY blog_lead_magnet_downloads_pidDownload_key (pidDownload),
      KEY blog_lead_magnet_downloads_pidMagnet_idx (pidMagnet),
      KEY blog_lead_magnet_downloads_pidBlog_idx (pidBlog),
      KEY blog_lead_magnet_downloads_email_idx (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const url = new URL(request.url)
  const email = url.searchParams.get("email")?.trim().toLowerCase() || null

  await ensureDownloadTables()

  const rows = await prisma.$queryRaw<LeadMagnetRow[]>(
    Prisma.sql`
      SELECT pidMagnet, pidBlog, slug, title, description, pdfJson
      FROM blog_lead_magnets
      WHERE slug = ${slug}
        AND status IN ('draft', 'active')
      LIMIT 1
    `,
  )

  const magnet = rows[0]
  if (!magnet) {
    return NextResponse.json({ success: false, error: "Lead magnet not found." }, { status: 404 })
  }

  try {
    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO blog_lead_magnet_downloads (
          pidDownload,
          pidMagnet,
          pidBlog,
          email,
          source,
          pageUrl,
          createdAt
        ) VALUES (
          ${crypto.randomUUID()},
          ${magnet.pidMagnet},
          ${magnet.pidBlog},
          ${email},
          ${url.searchParams.get("source") || "download"},
          ${request.headers.get("referer")},
          ${new Date()}
        )
      `,
    )
  } catch (error) {
    console.error("Lead magnet download log failed", error)
  }

  const buffer = renderLeadMagnetPdfBuffer({
    title: magnet.title,
    description: magnet.description,
    pdf: safeJsonParse(magnet.pdfJson),
    baseUrl: process.env.ROOT_URL || url.origin || "https://www.sureimports.com",
  })

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameFromSlug(magnet.slug)}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
