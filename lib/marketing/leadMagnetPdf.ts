import { jsPDF } from "jspdf"

interface PdfContent {
  title?: string
  subtitle?: string
  audience?: string
  promise?: string
  sections?: Array<{ heading?: string; items?: string[] }>
  actionPlan?: string[]
  closingNote?: string
  serviceCta?: {
    label?: string
    headline?: string
    body?: string
    url?: string
  }
}

function clean(value: unknown, fallback = "") {
  return String(value || fallback).replace(/\s+/g, " ").trim()
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

function ensureRoom(doc: jsPDF, y: number, required = 35) {
  if (y + required < 282) return y
  doc.addPage()
  return 22
}

function addHeaderBrand(doc: jsPDF) {
  doc.setFillColor(249, 115, 22)
  doc.roundedRect(151, 10, 9, 9, 1.5, 1.5, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text("S", 154, 16.4)

  doc.setFontSize(12)
  doc.text("Sure Imports", 164, 14.8)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(6.8)
  doc.setTextColor(203, 213, 225)
  doc.text("China sourcing and shipping", 164, 19)
  doc.text("support for importers", 164, 22.5)
}

function addPageFooters(doc: jsPDF, baseUrl: string) {
  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFillColor(248, 250, 252)
    doc.rect(0, 284, 210, 13, "F")
    doc.setDrawColor(226, 232, 240)
    doc.line(14, 284, 196, 284)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(15, 23, 42)
    doc.text("Sure Imports", 14, 290)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 116, 139)
    doc.text("Start your importation with peace of mind", 38, 290)
    doc.text("www.sureimports.com", 14, 294)
    doc.text(`Page ${page} of ${pageCount}`, 176, 290)
  }
}

const existingPublicCtaPaths = new Set([
  "/",
  "/buy-from-chinese-websites",
  "/ship-with-us",
  "/buy-phones-from-china",
  "/laptops-for-business",
  "/corporate-gifts",
  "/shipping-rate",
  "/tools/landed-cost-estimator",
])

const legacyCtaPathMap: Record<string, string> = {
  "/procurement": "/buy-from-chinese-websites",
  "/source-products-from-china": "/corporate-gifts",
  "/pay-supplier": "/corporate-gifts",
  "/verify-supplier": "/corporate-gifts",
  "/contact": "/corporate-gifts",
}

const serviceCtaCopy: Record<string, { headline: string; body: string }> = {
  "/buy-from-chinese-websites": {
    headline: "Already found the product links you want to buy?",
    body: "Use SureImports to submit links from sites like 1688, Alibaba, Taobao or Pinduoduo. We review the order details, keep the purchase record clear and coordinate buying through your SureImports account.",
  },
  "/ship-with-us": {
    headline: "Already paid a supplier and only need shipping?",
    body: "Use Ship With Us when your goods are ready in China. Your supplier sends the items to the SureImports China warehouse and we coordinate shipping, consolidation updates and delivery support.",
  },
  "/corporate-gifts": {
    headline: "Need structured sourcing with a clearer cost view?",
    body: "Use Corporate Sourcing for supplier search, product comparison, branding or customization, quote review, inspection planning, shipping and delivery support for business or bulk orders.",
  },
  "/buy-phones-from-china": {
    headline: "Buying phones or mobile devices from China?",
    body: "Use the phone sourcing service for device-focused orders where model, condition, specification, payment and delivery handling need extra attention.",
  },
  "/laptops-for-business": {
    headline: "Need laptops for a team, school or reseller order?",
    body: "Use Laptops for Business for bulk laptop sourcing, configuration planning and business-focused device procurement support.",
  },
  "/shipping-rate": {
    headline: "Need to estimate shipping before you commit?",
    body: "Use the shipping rate page to understand SureImports shipping options before deciding whether to buy, source or ship goods from China.",
  },
  "/tools/landed-cost-estimator": {
    headline: "Need a clearer landed cost estimate first?",
    body: "Use the landed cost estimator to model product cost, shipping assumptions and margin before you decide whether an order is worth pursuing.",
  },
}

const lineScoutCtaCopy = {
  headline: "Sourcing machines, equipment or industrial products?",
  body: "Use LineScout for machinery and equipment sourcing guidance where supplier qualification, specifications, inspection expectations and total project risk need closer review.",
}

function normalizeUrl(value: unknown, baseUrl: string) {
  const raw = clean(value)
  if (!raw) return new URL("/corporate-gifts", baseUrl).toString()

  try {
    const parsed = new URL(raw)
    if (parsed.hostname === "linescout.sureimports.com") {
      return "https://linescout.sureimports.com/"
    }
    const mappedPath = legacyCtaPathMap[parsed.pathname] || parsed.pathname
    if (!existingPublicCtaPaths.has(mappedPath)) {
      return new URL("/corporate-gifts", baseUrl).toString()
    }
    return new URL(`${mappedPath}${parsed.search}${parsed.hash}`, baseUrl).toString()
  } catch {
    try {
      const path = raw.startsWith("/") ? raw : `/${raw}`
      const parsed = new URL(path, baseUrl)
      const mappedPath = legacyCtaPathMap[parsed.pathname] || parsed.pathname
      if (!existingPublicCtaPaths.has(mappedPath)) {
        return new URL("/corporate-gifts", baseUrl).toString()
      }
      return new URL(`${mappedPath}${parsed.search}${parsed.hash}`, baseUrl).toString()
    } catch {
      return new URL("/corporate-gifts", baseUrl).toString()
    }
  }
}

function getServiceCtaCopy(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === "linescout.sureimports.com") return lineScoutCtaCopy
    return serviceCtaCopy[parsed.pathname] || serviceCtaCopy["/corporate-gifts"]
  } catch {
    return serviceCtaCopy["/corporate-gifts"]
  }
}

export function renderLeadMagnetPdfBuffer(input: {
  title: string
  description?: string | null
  pdf: PdfContent
  baseUrl?: string
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const pdf = input.pdf || {}
  const title = clean(pdf.title, input.title)
  const subtitle = clean(pdf.subtitle, input.description || "")
  const baseUrl = input.baseUrl || "https://www.sureimports.com"

  doc.setFillColor(13, 19, 33)
  doc.rect(0, 0, 210, 52, "F")
  doc.setFillColor(249, 115, 22)
  doc.rect(0, 49, 210, 3, "F")
  addHeaderBrand(doc)
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(19)
  addWrappedText(doc, title, 16, 19, 126, 7)

  if (subtitle) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10.5)
    addWrappedText(doc, subtitle, 16, 36, 126, 5)
  }

  doc.setTextColor(15, 23, 42)
  let y = 67

  const audience = clean(pdf.audience)
  const promise = clean(pdf.promise)
  if (audience || promise) {
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(14, y - 7, 182, 25, 2, 2, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text("WHO THIS IS FOR", 18, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    y = addWrappedText(doc, [audience, promise].filter(Boolean).join(" - "), 18, y + 7, 172, 5) + 10
  }

  const sections = Array.isArray(pdf.sections) ? pdf.sections.slice(0, 4) : []
  for (const section of sections) {
    y = ensureRoom(doc, y, 38)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.setTextColor(234, 88, 12)
    y = addWrappedText(doc, clean(section.heading, "Key points"), 16, y, 178, 6) + 3

    doc.setTextColor(15, 23, 42)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10.5)
    const items = Array.isArray(section.items) ? section.items.slice(0, 6) : []
    for (const item of items) {
      y = ensureRoom(doc, y, 14)
      doc.text("•", 18, y)
      y = addWrappedText(doc, clean(item), 24, y, 166, 5) + 2
    }
    y += 4
  }

  const actionPlan = Array.isArray(pdf.actionPlan) ? pdf.actionPlan.slice(0, 6) : []
  if (actionPlan.length) {
    y = ensureRoom(doc, y, 40)
    doc.setFillColor(255, 247, 237)
    doc.roundedRect(14, y - 6, 182, Math.min(70, 14 + actionPlan.length * 8), 2, 2, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(154, 52, 18)
    doc.text("Action plan", 18, y)
    y += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10.5)
    doc.setTextColor(15, 23, 42)
    actionPlan.forEach((item, index) => {
      y = addWrappedText(doc, `${index + 1}. ${clean(item)}`, 20, y, 166, 5) + 2
    })
    y += 8
  }

  const cta = pdf.serviceCta || {}
  if (cta.headline || cta.body || cta.url) {
    y = ensureRoom(doc, y, 42)
    const ctaUrl = normalizeUrl(cta.url, baseUrl)
    const ctaCopy = getServiceCtaCopy(ctaUrl)

    doc.setFillColor(13, 19, 33)
    doc.roundedRect(14, y - 6, 182, 42, 2, 2, "F")
    doc.link(14, y - 6, 182, 42, { url: ctaUrl })

    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text(ctaCopy.headline, 18, y)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    addWrappedText(doc, ctaCopy.body, 18, y + 8, 170, 5)
    doc.setTextColor(251, 146, 60)
    doc.setFont("helvetica", "bold")
    doc.text(ctaUrl, 18, y + 32)
    doc.link(18, y + 28, 170, 7, { url: ctaUrl })
  }

  const closingNote = clean(pdf.closingNote)
  if (closingNote) {
    y = ensureRoom(doc, y + 42, 20)
    doc.setTextColor(71, 85, 105)
    doc.setFont("helvetica", "italic")
    doc.setFontSize(10)
    addWrappedText(doc, closingNote, 16, y, 178, 5)
  }

  addPageFooters(doc, baseUrl)

  return Buffer.from(doc.output("arraybuffer"))
}
