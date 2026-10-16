CREATE TABLE IF NOT EXISTS sure_apple_attempts (
 namespace VARCHAR(32) NOT NULL, token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 binding_hash CHAR(64) NOT NULL, kind VARCHAR(12) NOT NULL, payload JSON NOT NULL,
 expires_at DATETIME(3) NOT NULL, PRIMARY KEY(namespace,token_hash), KEY(expires_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS sure_apple_identities (
 namespace VARCHAR(32) NOT NULL, client_id VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
 provider VARCHAR(12) NOT NULL, subject VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL, account_id VARCHAR(80) NOT NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), terms_version VARCHAR(40),
 PRIMARY KEY(namespace,client_id,subject), UNIQUE KEY account_provider(namespace,client_id,account_id)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS sure_apple_limits (
 bucket_key CHAR(64) NOT NULL PRIMARY KEY, hits INT NOT NULL, expires_at DATETIME NOT NULL, KEY(expires_at)
) ENGINE=InnoDB;
