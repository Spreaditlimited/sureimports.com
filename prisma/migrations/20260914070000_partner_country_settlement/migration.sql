UPDATE partner_country_policies
SET policyJson=JSON_SET(policyJson,'$.settlementCurrency',CASE WHEN code='GB' THEN 'GBP' ELSE 'NGN' END,'$.revision',revision+1),revision=revision+1,updatedAt=NOW(3)
WHERE code IN ('GB','NG') AND JSON_EXTRACT(policyJson,'$.settlementCurrency') IS NULL;
INSERT INTO partner_country_policy_history (code,revision,policyJson,actorPid)
SELECT c.code,c.revision,c.policyJson,'MIGRATION' FROM partner_country_policies c
WHERE NOT EXISTS (SELECT 1 FROM partner_country_policy_history h WHERE h.code=c.code AND h.revision=c.revision);
