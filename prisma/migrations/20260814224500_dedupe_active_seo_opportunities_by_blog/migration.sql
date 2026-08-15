UPDATE `seo_opportunities` AS opportunity
INNER JOIN (
  SELECT
    ranked.id,
    ROW_NUMBER() OVER (
      PARTITION BY ranked.blogSlug
      ORDER BY
        CASE WHEN ranked.status = 'reviewing' THEN 0 ELSE 1 END,
        ranked.impressions DESC,
        ranked.updatedAt DESC,
        ranked.id DESC
    ) AS rowNumber
  FROM `seo_opportunities` AS ranked
  WHERE ranked.blogSlug IS NOT NULL
    AND ranked.status IN ('open', 'reviewing')
) AS duplicate ON duplicate.id = opportunity.id
SET opportunity.status = 'dismissed',
    opportunity.updatedAt = CURRENT_TIMESTAMP(3)
WHERE duplicate.rowNumber > 1;

CREATE INDEX `seo_opportunities_blogSlug_status_idx`
  ON `seo_opportunities` (`blogSlug`, `status`);
