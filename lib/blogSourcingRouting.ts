const LINESCOUT_ROUTES = {
  whiteLabel:
    'https://linescout.sureimports.com/sourcing-project?route_type=white_label',
  bulk: 'https://linescout.sureimports.com/sourcing-project?route_type=simple_sourcing',
  machine:
    'https://linescout.sureimports.com/sourcing-project?route_type=machine_sourcing',
};

const PRODUCT_GUIDES: Record<string, string> = {
  'beyond-the-old-t-shirt-why-microfiber-cloths-are-nigeria-s-next-big-white-label-essential':
    'https://linescout.sureimports.com/white-label/reusable-microfiber-cleaning-cloths',
  'building-a-high-profit-white-label-brand-with-luggage-straps-in-nigeria':
    'https://linescout.sureimports.com/white-label/luggage-strap-with-buckle',
  'the-invisible-goldmine-why-foldable-laundry-bags-are-nigeria-s-most-underrated-white-label-opportunity':
    'https://linescout.sureimports.com/white-label/foldable-laundry-basket',
};

const CORPORATE_PILLAR_SLUG =
  'corporate-sourcing-from-china-to-nigeria-pillar-guide-for-business-buyers';

const CORPORATE_LINK =
  /<a\b([^>]*?)href=(["'])(?:https?:\/\/(?:www\.)?sureimports\.com)?\/corporate-sourcing(?:#[^"']*)?\2([^>]*)>([\s\S]*?)<\/a>/gi;

function routeCorporateLinks(
  html: string,
  destination: string,
  label: string,
) {
  return html.replace(
    CORPORATE_LINK,
    (match, before, _quote, after, anchorHtml) => {
      const attributes = `${before} ${after}`;
      const anchorText = String(anchorHtml || '').replace(/<[^>]*>/g, ' ');
      const isExplicitCorporateRoute =
        /data-sourcing-audience\s*=\s*(["'])corporate\1/i.test(attributes) ||
        /\bcorporate sourcing\b/i.test(anchorText);

      if (isExplicitCorporateRoute) return match;
      return `<a${before}href="${destination}"${after}>${label}</a>`;
    },
  );
}

export function routeBlogSourcingLinks(input: {
  slug: string;
  title: string;
  html: string;
}) {
  const { slug, title } = input;
  const html = (input.html || '').replace(
    /<img\b[^>]*\bsrc\s*=\s*(["'])data:[\s\S]*?\1[^>]*>/gi,
    '',
  );
  const productGuide = PRODUCT_GUIDES[slug];

  if (productGuide) {
    return routeCorporateLinks(
      html,
      productGuide,
      'continue this product in LineScout',
    );
  }

  if (slug === CORPORATE_PILLAR_SLUG) {
    if (html.includes('data-sourcing-audience="corporate"')) return html;
    const notice = `<aside data-sourcing-audience="corporate" class="my-8 rounded-2xl border border-brand-orange-200 bg-brand-orange-50 p-5 text-slate-800 dark:border-brand-orange-500/20 dark:bg-brand-orange-500/10 dark:text-slate-200"><p><strong>Who this service is for:</strong> Sure Imports Corporate Sourcing is reserved for banks, large companies, institutions, government bodies and NGOs with formal procurement requirements. Individuals and small businesses should <a class="font-bold text-brand-orange-600 underline underline-offset-4 dark:text-brand-orange-400" href="${LINESCOUT_ROUTES.bulk}">manage product, bulk and machine sourcing in LineScout</a>.</p></aside>`;
    return `${notice}${html}`;
  }

  const subject = `${title} ${slug}`;
  if (/\b(white[ -]?label|private[ -]?label|oem|odm|own brand)\b/i.test(subject)) {
    return routeCorporateLinks(
      html,
      LINESCOUT_ROUTES.whiteLabel,
      'start a LineScout white-label sourcing project',
    );
  }
  if (/\b(machine|machinery|industrial equipment|production line|manufacturing equipment)\b/i.test(subject)) {
    return routeCorporateLinks(
      html,
      LINESCOUT_ROUTES.machine,
      'start a LineScout machine sourcing project',
    );
  }
  if (/\b(bulk sourcing|wholesale sourcing|source products?|product sourcing|find (?:a )?supplier)\b/i.test(subject)) {
    return routeCorporateLinks(
      html,
      LINESCOUT_ROUTES.bulk,
      'start a LineScout sourcing project',
    );
  }

  return html;
}
