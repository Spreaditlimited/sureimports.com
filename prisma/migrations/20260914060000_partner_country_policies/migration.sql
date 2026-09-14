CREATE TABLE partner_country_policies (
  code CHAR(2) NOT NULL PRIMARY KEY,
  policyJson TEXT NOT NULL,
  revision INT NOT NULL,
  updatedBy VARCHAR(191) NULL,
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE partner_country_policy_history (
  code CHAR(2) NOT NULL,
  revision INT NOT NULL,
  policyJson TEXT NOT NULL,
  actorPid VARCHAR(191) NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (code, revision)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE partner_application_country_policy (
  partnerId VARCHAR(191) NOT NULL PRIMARY KEY,
  countryCode CHAR(2) NOT NULL,
  revision INT NOT NULL,
  policyJson TEXT NOT NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO partner_country_policies (code, revision, policyJson) VALUES
('NG',1,'{"code":"NG","name":"Nigeria","status":"OPEN","verificationProfile":"NG_BUSINESS","allowIndividuals":false,"allowCompanies":true,"billingCurrency":"NGN","monthlyFeeMinor":0,"trialDays":14,"minimumAge":18,"addressEvidenceMonths":6,"requireIdentityMeeting":false,"requireOwnNamePayout":true,"extraDocuments":[],"revision":1}'),
('GB',1,'{"code":"GB","name":"United Kingdom","status":"OPEN","verificationProfile":"UK_STANDARD","allowIndividuals":true,"allowCompanies":true,"billingCurrency":"GBP","monthlyFeeMinor":0,"trialDays":14,"minimumAge":18,"addressEvidenceMonths":3,"requireIdentityMeeting":true,"requireOwnNamePayout":true,"extraDocuments":[],"revision":1}');
INSERT INTO partner_country_policy_history (code,revision,policyJson,actorPid) SELECT code,revision,policyJson,'MIGRATION' FROM partner_country_policies;
INSERT INTO partner_application_country_policy (partnerId,countryCode,revision,policyJson)
SELECT p.id,c.code,c.revision,c.policyJson FROM procurement_partners p INNER JOIN partner_country_policies c ON c.code=p.country;
