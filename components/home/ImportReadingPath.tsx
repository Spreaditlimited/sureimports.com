import Link from 'next/link';
import styles from './ImportGuide.module.css';

const guides = [
  {
    title: 'Plan your budget',
    description:
      'Separate buying, delivery and selling costs before you ask for quotes.',
    slug: 'how-to-build-a-china-import-budget-before-you-contact-any-supplier',
    label: 'Build an import budget',
    nextSlug:
      'the-profit-blueprint-how-to-turn-your-landed-cost-into-a-confident-selling-price',
    nextLabel: 'Then check your selling price',
  },
  {
    title: 'Check the supplier',
    description:
      'Know what evidence to request and compare like-for-like specifications.',
    slug: 'china-supplier-verification-checklist-for-nigerian-importers',
    label: 'Use the supplier checklist',
    nextSlug:
      'how-to-compare-china-supplier-quotes-like-a-serious-nigerian-buyer',
    nextLabel: 'Then compare supplier quotes',
  },
  {
    title: 'Approve before production',
    description:
      'Turn sample feedback and packaging decisions into a clear written brief.',
    slug: 'product-samples-from-china-to-nigeria-when-they-are-worth-paying-for',
    label: 'Plan your sample checks',
    nextSlug:
      'private-label-packaging-from-china-for-nigerian-brands-what-to-decide-before-production',
    nextLabel: 'Then prepare your packaging brief',
  },
];

export default function ImportReadingPath({
  market = 'both',
}: {
  market?: 'both' | 'uk';
}) {
  return (
    <section
      id="buying-guides"
      className={styles.section}
      aria-labelledby="buying-guides-heading"
    >
      <span className={styles.eyebrow}>Read what matters next</span>
      <h2 id="buying-guides-heading" className={styles.heading}>
        Three steps towards a better buying decision.
      </h2>
      <p className={styles.lede}>
        {market === 'uk'
          ? 'These guides now include clearly labelled UK sections. Their original Nigeria examples remain, so use the UK guidance for your destination and costs.'
          : 'Start with your destination above, then work through these practical guides. Each includes Nigeria guidance and a separate UK section.'}
      </p>
      <ol className={styles.readingPath}>
        {guides.map((guide, index) => (
          <li key={guide.slug}>
            <span className={styles.eyebrow}>Step {index + 1}</span>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <div className={styles.readingLinks}>
              <Link className={styles.textLink} href={`/blog/${guide.slug}`}>
                {guide.label}
              </Link>
              {market === 'uk' ? (
                <Link
                  className={styles.textLink}
                  href={`/blog/${guide.nextSlug}`}
                >
                  {guide.nextLabel}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
