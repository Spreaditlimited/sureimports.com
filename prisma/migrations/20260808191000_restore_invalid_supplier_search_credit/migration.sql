START TRANSACTION;

UPDATE `intelligence_credit_accounts` AS account
INNER JOIN `intelligence_search_requests` AS request
  ON request.`pidUser` = account.`pidUser`
LEFT JOIN `intelligence_credit_transactions` AS prior_refund
  ON prior_refund.`pidUser` = request.`pidUser`
  AND prior_refund.`reference` = request.`pidSearch`
  AND prior_refund.`reason` IN (
    'invalid_search_refunded',
    'search_request_refunded'
  )
SET
  account.`balance` = account.`balance` + request.`creditCost`,
  account.`lifetimeUsed` = GREATEST(0, account.`lifetimeUsed` - request.`creditCost`),
  account.`updatedAt` = CURRENT_TIMESTAMP(3)
WHERE LOWER(TRIM(COALESCE(request.`originalQuery`, request.`query`))) = 'supermarket target for my area'
  AND request.`creditSource` = 'free'
  AND request.`creditReserved` = 1
  AND request.`creditCost` > 0
  AND prior_refund.`id` IS NULL;

INSERT INTO `intelligence_credit_transactions` (
  `pidTransaction`,
  `pidUser`,
  `amount`,
  `reason`,
  `reference`,
  `createdAt`
)
SELECT
  CONCAT('INTCTXFIX', LEFT(REPLACE(request.`pidSearch`, 'INTSRCH', ''), 60)),
  request.`pidUser`,
  request.`creditCost`,
  'invalid_search_refunded',
  request.`pidSearch`,
  CURRENT_TIMESTAMP(3)
FROM `intelligence_search_requests` AS request
LEFT JOIN `intelligence_credit_transactions` AS prior_refund
  ON prior_refund.`pidUser` = request.`pidUser`
  AND prior_refund.`reference` = request.`pidSearch`
  AND prior_refund.`reason` IN (
    'invalid_search_refunded',
    'search_request_refunded'
  )
WHERE LOWER(TRIM(COALESCE(request.`originalQuery`, request.`query`))) = 'supermarket target for my area'
  AND request.`creditSource` = 'free'
  AND request.`creditReserved` = 1
  AND request.`creditCost` > 0
  AND prior_refund.`id` IS NULL;

UPDATE `intelligence_research_jobs` AS job
INNER JOIN `intelligence_search_requests` AS request
  ON request.`relatedPidJob` = job.`pidJob`
SET
  job.`status` = 'rejected',
  job.`errorMessage` = 'Invalid market-intent request. No supplier result was published.',
  job.`updatedAt` = CURRENT_TIMESTAMP(3)
WHERE LOWER(TRIM(COALESCE(request.`originalQuery`, request.`query`))) = 'supermarket target for my area'
  AND request.`creditSource` = 'free'
  AND request.`creditReserved` = 1
  AND job.`status` NOT IN ('approved', 'partially_approved');

UPDATE `intelligence_search_requests`
SET
  `status` = 'invalid',
  `creditReserved` = 0,
  `adminNotes` = 'This market-intent query was not a valid physical-product supplier search. The free credit has been restored.',
  `progressStage` = 'Invalid request — credit restored',
  `progressPercent` = 100,
  `updatedAt` = CURRENT_TIMESTAMP(3)
WHERE LOWER(TRIM(COALESCE(`originalQuery`, `query`))) = 'supermarket target for my area'
  AND `creditSource` = 'free'
  AND `creditReserved` = 1
  AND `creditCost` > 0;

COMMIT;
