/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { v2: cloudinary } = require('cloudinary');

const prisma = new PrismaClient();

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, 'public', 'blog-image-tests');
const CLOUDINARY_FOLDER = 'sureimports/blog';

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    force: false,
    localOnly: false,
    limit: 1,
    slug: '',
  };

  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    if (arg === '--force') args.force = true;
    if (arg === '--local-only') args.localOnly = true;
    if (arg.startsWith('--limit=')) args.limit = Number(arg.slice(8));
    if (arg.startsWith('--slug=')) args.slug = arg.slice(7).trim();
  }

  if (!Number.isFinite(args.limit) || args.limit < 1) {
    args.limit = 1;
  }

  return args;
}

function requireEnv(name) {
  const value = String(process.env[name] || '').trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function isCloudinaryUrl(value) {
  const url = String(value || '').trim();
  return url.includes('res.cloudinary.com/') && url.includes('/upload/');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength) {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

function safeFileName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function getCreativeDirection(post) {
  const text = `${post.blogTitle || ''} ${post.blogSlug || ''}`.toLowerCase();

  if (text.includes('shipping') || text.includes('freight')) {
    return [
      'Concept: logistics decision scene without people.',
      'Show a clean tabletop scale model of sea freight versus air freight: miniature unbranded containers, a cargo plane silhouette model, sealed cartons, route pins, measuring tape, and CBM-style cube blocks.',
      'Avoid desks that look like procurement paperwork. Make shipping method comparison the unmistakable subject.',
    ].join(' ');
  }

  if (
    text.includes('soncap') ||
    text.includes('nafdac') ||
    text.includes('customs') ||
    text.includes('documentation')
  ) {
    return [
      'Concept: import compliance and documentation scene without people.',
      'Show a neat compliance workspace with sealed product sample boxes, blank geometric approval cards, simple check-mark tiles, plain circular seal icons, a customs-inspired stamp pad with no letters, and neutral inspection tags.',
      'Do not show certificates, titled forms, official documents, headings, acronyms, or any text-like marks. Make regulatory readiness, documentation, and border compliance the subject using only blank shapes, check marks, seals, boxes, and stamps.',
    ].join(' ');
  }

  if (
    text.includes('profitable') ||
    text.includes('choose products') ||
    text.includes('product samples')
  ) {
    return [
      'Concept: product opportunity selection scene without people.',
      'Show a curated grid of diverse unbranded mini-import product samples on a clean tabletop: small electronics accessories, beauty tools, household gadgets, packaging inserts, blank margin cards, color-coded category tabs, and a simple abstract demand chart made of blocks.',
      'Make market selection and profitability analysis the subject without readable labels, logos, or repeated warehouse-desk composition.',
    ].join(' ');
  }

  if (text.includes('corporate sourcing') || text.includes('business buyers')) {
    return [
      'Concept: corporate procurement planning scene without people.',
      'Show a premium boardroom-style procurement layout: sample materials, unbranded product swatches, sealed proposal folders with blank covers, specification cards with blank rows, a tablet showing abstract supplier score blocks, and orderly cartons near a glass wall.',
      'Make structured corporate buying, vendor comparison, and procurement control the subject without any visible people or readable text.',
    ].join(' ');
  }

  if (text.includes('phone')) {
    return [
      'Concept: phone import quality-control scene without people.',
      'Show several unbranded smartphones arranged on anti-static mats beside sealed accessory pouches, barcode-like blank labels, protective foam inserts, a small inspection light, and cartons in the background.',
      'Phones must be generic with blank screens or abstract gradients, no app icons, no brand marks, and no readable packaging.',
    ].join(' ');
  }

  if (text.includes('laptop')) {
    return [
      'Concept: laptop import inspection scene without people.',
      'Show unbranded laptops partly open on a clean inspection bench with protective sleeves, foam inserts, power adapters, blank inventory stickers, sealed cartons, and a warehouse background.',
      'Laptop screens must be blank, softly glowing, or show abstract non-readable interface shapes only.',
    ].join(' ');
  }

  if (text.includes('landed cost') || text.includes('cost')) {
    return [
      'Concept: landed-cost calculation scene without people.',
      'Show a premium flat-lay arrangement of calculator, clean grid worksheet with blank cells, sealed cartons, measuring tape, scale, freight-cost tokens, and customs-inspired stamped shapes with no letters.',
      'The cost-calculation idea should be communicated through objects, columns, numbers represented as abstract blocks, and tidy layout rather than readable documents.',
    ].join(' ');
  }

  if (text.includes('supplier')) {
    return [
      'Concept: supplier verification scene without people.',
      'Show product samples under inspection lights, generic factory checklist cards represented only by blank rows and check marks, sealed sample cartons, loupe, caliper, and neutral warehouse shelving.',
      'Make verification, sampling, and due diligence the subject without readable words.',
    ].join(' ');
  }

  if (text.includes('1688') || text.includes('taobao') || text.includes('alibaba')) {
    return [
      'Concept: China website buying comparison without people.',
      'Show a clean comparison workspace with unbranded product samples in separate trays, generic blank browser windows on a screen, category tiles without text, cartons, and neutral color-coded tabs.',
      'No platform logos, no marketplace names, no readable interface text.',
    ].join(' ');
  }

  return [
    'Concept: distinctive import-business editorial still life without people.',
    'Choose objects specific to the article topic and avoid repeating the same laptop-calculator-carton composition unless the topic clearly requires it.',
    'Use a fresh camera angle, focal object, background, and object set for this article.',
  ].join(' ');
}

function buildPrompt(post) {
  const title = post.blogTitle;
  const category = post.category?.categoryName || 'China to Nigeria import';
  const excerpt = truncate(stripHtml(post.blogContent), 420);
  const creativeDirection = getCreativeDirection(post);

  return [
    `Premium editorial feature image for a Sure Imports blog article titled "${title}".`,
    `Topic category: ${category}. Article context: ${excerpt}`,
    creativeDirection,
    'Create a realistic, polished import-business still life for Nigerian importers, retailers, SMEs, and corporate buyers importing from China to Nigeria.',
    'Every image must feel conceptually different from other blog images: vary the scene type, focal object, camera angle, background, depth of field, object set, and color accents.',
    'Composition: landscape hero image, strong central subject, clear depth, balanced negative space, safe when cropped to 16:10, sharp foreground details, soft background.',
    'Mood: practical, trustworthy, modern import advisory, premium but not flashy.',
    'Color palette: clean whites, warm neutrals, subtle navy, slate, and restrained orange accents.',
    'No people. No faces. No hands. No arms. No body parts. No human figures. No mannequins. No reflections of people on screens or glass.',
    'If a laptop, tablet, or phone screen appears, it must face the viewer naturally and show only abstract dashboards, charts, or blurred interface shapes. Do not show a person holding or viewing any screen.',
    'If papers, labels, forms, checklists, invoices, clipboards, packaging, or screens appear, they must contain only blank lines, abstract marks, simple grids, check marks, or blurred non-readable shapes. No letters, no words, no numbers, and no fake gibberish text.',
    'No designed text overlays. No captions. No poster typography. No logos. No website addresses. No brand names. No watermarks. No flags. No currency symbols. No promotional copy.',
    'Photorealistic, high-end editorial photography, natural light, crisp details, professional blog feature image.',
  ].join(' ');
}

async function generateImage(post, outPath) {
  const apiKey = requireEnv('OPENAI_API_KEY');
  const prompt = buildPrompt(post);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.BLOG_IMAGE_MODEL || 'gpt-image-1',
      prompt,
      size: process.env.BLOG_IMAGE_SIZE || '1536x1024',
      quality: process.env.BLOG_IMAGE_QUALITY || 'high',
      n: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OpenAI image error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data returned');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
}

async function uploadImage(outPath, publicId) {
  requireEnv('CLOUDINARY_CLOUD_NAME');
  requireEnv('CLOUDINARY_API_KEY');
  requireEnv('CLOUDINARY_API_SECRET');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary.uploader.upload(outPath, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    overwrite: true,
    use_filename: false,
    unique_filename: false,
    resource_type: 'image',
  });
}

async function findPosts(args) {
  const where = {
    blogPublished: true,
    xStaus: 'active',
    ...(args.slug ? { blogSlug: args.slug } : {}),
    ...(args.force ? {} : { OR: [{ blogImage: null }, { blogImage: '' }] }),
  };

  return prisma.blog.findMany({
    where,
    include: { category: true },
    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    take: args.slug ? 1 : args.limit,
  });
}

async function run() {
  loadEnv(path.join(ROOT, '.env.local'));
  const args = parseArgs(process.argv.slice(2));
  const posts = await findPosts(args);

  if (!posts.length) {
    console.log('No matching blog posts need feature images.');
    return;
  }

  console.log(
    `Preparing ${posts.length} blog feature image${posts.length === 1 ? '' : 's'}.`,
  );

  for (const post of posts) {
    const slug = safeFileName(post.blogSlug || post.blogTitle || post.pidBlog);
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
    const existingImage = String(post.blogImage || '').trim();

    if (!args.force && isCloudinaryUrl(existingImage)) {
      console.log(`[skip] ${slug} already has Cloudinary image`);
      continue;
    }

    if (args.dryRun) {
      console.log(`[dry-run] ${post.blogTitle} -> ${outPath}`);
      continue;
    }

    if (!fs.existsSync(outPath) || args.force) {
      console.log(`[generate] ${post.blogTitle}`);
      await generateImage(post, outPath);
    } else {
      console.log(`[reuse-local] ${outPath}`);
    }

    if (args.localOnly) {
      console.log(`[local-only] ${outPath}`);
      continue;
    }

    const publicId = `${slug}`;
    const uploaded = await uploadImage(outPath, publicId);

    await prisma.blog.update({
      where: { pidBlog: post.pidBlog },
      data: { blogImage: uploaded.secure_url, updatedAt: new Date() },
    });

    console.log(`[updated] ${slug} -> ${uploaded.secure_url}`);
  }
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
