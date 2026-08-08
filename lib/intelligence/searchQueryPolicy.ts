export type SupplierSearchQueryAssessment = {
  status: 'valid' | 'needs_clarification' | 'out_of_scope';
  originalQuery: string;
  canonicalQuery: string | null;
  message: string;
  suggestions: string[];
};

const CONTEXT_ONLY_WORDS = new Set([
  'area',
  'business',
  'buyer',
  'customer',
  'city',
  'company',
  'country',
  'idea',
  'market',
  'nearby',
  'shop',
  'store',
  'supermarket',
  'target',
]);

const REQUEST_WORDS = new Set([
  'buy',
  'find',
  'looking',
  'need',
  'research',
  'search',
  'source',
  'want',
]);

const OUT_OF_SCOPE_PATTERN =
  /\b(?:customers?|buyers?|target\s+(?:market|audience)|market\s+(?:demand|research|size)|where\s+to\s+sell|how\s+to\s+sell|business\s+ideas?|profitable\s+(?:business|products?)|sales\s+strategy)\b/i;

const CONTEXT_BOUNDARY_PATTERN =
  /\b(?:for\s+(?:my|our)\s+(?:area|market|customers?|business|target\s+(?:market|audience))|in\s+(?:my|our)\s+(?:area|market|city|country)|near\s+me|target\s+(?:market|audience)|where\s+to\s+sell|how\s+to\s+sell|market\s+(?:demand|research|size))\b/i;

const GENERIC_CATEGORY_WORDS = new Set([
  'product',
  'products',
  'item',
  'items',
  'goods',
  'supply',
  'supplies',
  'supplier',
  'suppliers',
  'manufacturer',
  'manufacturers',
  'factory',
  'factories',
  'set',
  'sets',
]);

function singularize(token: string) {
  if (token === 'shelving' || token === 'shelves') return 'shelf';
  if (token.endsWith('ies') && token.length > 4)
    return `${token.slice(0, -3)}y`;
  if (token.endsWith('ses') && token.length > 4) return token.slice(0, -2);
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1);
  return token;
}

function normalizeTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\bgensets?\b/g, ' generator ')
    .replace(/\bgenerator\s+sets?\b/g, ' generator ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .map((token) => singularize(token.trim()))
    .filter((token) => token.length > 1 && !GENERIC_CATEGORY_WORDS.has(token));
}

function cleanQuery(value: string) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

function meaningfulProductTokens(value: string) {
  return normalizeTokens(value).filter(
    (token) =>
      !CONTEXT_ONLY_WORDS.has(token) &&
      !REQUEST_WORDS.has(token) &&
      !['china', 'chinese', 'wholesale', 'wholesaler'].includes(token),
  );
}

function candidateProductPhrase(query: string) {
  const boundary = query.search(CONTEXT_BOUNDARY_PATTERN);
  const beforeContext = boundary >= 0 ? query.slice(0, boundary) : query;

  return beforeContext
    .replace(
      /^(?:please\s+)?(?:i\s+(?:am\s+)?(?:want|need|looking\s+for)|we\s+(?:want|need)|find|search\s+for|research|source)\s+/i,
      '',
    )
    .replace(/\s+(?:suppliers?|manufacturers?|factories|wholesalers?)$/i, '')
    .replace(/[?.!,;:]+$/g, '')
    .trim();
}

export function assessSupplierSearchQuery(
  value: string,
): SupplierSearchQueryAssessment {
  const originalQuery = cleanQuery(value);
  const suggestions = [
    'Commercial supermarket shelves',
    'Shopping trolleys',
    'Supermarket display chillers',
  ];

  if (originalQuery.length < 2) {
    return {
      status: 'needs_clarification',
      originalQuery,
      canonicalQuery: null,
      message: 'Enter the physical product you want manufacturers for.',
      suggestions,
    };
  }

  const candidate = candidateProductPhrase(originalQuery);
  const productTokens = meaningfulProductTokens(candidate);

  if (productTokens.length === 0) {
    const outOfScope = OUT_OF_SCOPE_PATTERN.test(originalQuery);
    return {
      status: outOfScope ? 'out_of_scope' : 'needs_clarification',
      originalQuery,
      canonicalQuery: null,
      message: outOfScope
        ? 'Supplier Intelligence finds manufacturers for physical products. It does not research customers, target markets, business ideas, or where to sell.'
        : 'Name the specific physical product you want sourced. For example: supermarket shelves, shopping trolleys, or display chillers.',
      suggestions,
    };
  }

  if (/^(?:what|which|where|how|who|why)\b/i.test(originalQuery)) {
    return {
      status: 'out_of_scope',
      originalQuery,
      canonicalQuery: null,
      message:
        'Enter a product or product category, not a general business or market-research question.',
      suggestions,
    };
  }

  return {
    status: 'valid',
    originalQuery,
    canonicalQuery: candidate || originalQuery,
    message: 'Confirm the product before Sure Imports uses a search credit.',
    suggestions: [],
  };
}

export function supplierCategoryMatchScore(query: string, category: string) {
  const assessment = assessSupplierSearchQuery(query);
  if (assessment.status !== 'valid' || !assessment.canonicalQuery) return 0;

  const queryTokens = new Set(normalizeTokens(assessment.canonicalQuery));
  const categoryTokens = new Set(normalizeTokens(category));
  if (!queryTokens.size || !categoryTokens.size) return 0;

  const intersection = Array.from(queryTokens).filter((token) =>
    categoryTokens.has(token),
  ).length;
  const queryCoverage = intersection / queryTokens.size;
  const categoryCoverage = intersection / categoryTokens.size;

  if (queryCoverage === 1 && categoryCoverage === 1) return 100;
  if (queryCoverage < 2 / 3 || categoryCoverage < 2 / 3) return 0;

  return Math.round(queryCoverage * 50 + categoryCoverage * 50);
}
