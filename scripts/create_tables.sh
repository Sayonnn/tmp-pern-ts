#!/bin/bash

# -----------------------------
# PostgreSQL Database Setup Script (Enhanced for 2FA, CAPTCHA, OAuth)
# -----------------------------

APP_NAME="appname"  
DB_ABBR="app"
DB_NAME="db_${APP_NAME}"
DB_USER="${APP_NAME}"
DB_PASSWORD="${APP_NAME}19!"
DB_CONTAINER="db_${APP_NAME}"
DB_HOST="postgres"
DB_PORT="5432"

export PGPASSWORD=$DB_PASSWORD

echo "Dropping old ${DB_ABBR}_ tables (if any) and creating enhanced tables in database '$DB_NAME'..."

docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME <<EOSQL

-- Drop existing tables
DROP TABLE IF EXISTS ${DB_ABBR}_login_history CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_refresh_tokens CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_admins CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_clients CASCADE;

-- -----------------------------
-- Clients Table (with 2FA, OAuth, CAPTCHA)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_clients (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    permissions JSONB DEFAULT '{}',
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    provider VARCHAR(50) NOT NULL DEFAULT 'local',        -- local | google | github | sso
    provider_id VARCHAR(255),                              -- social login id
    is_verified BOOLEAN DEFAULT FALSE,                     -- email verified
    twofa_secret VARCHAR(255),                             -- speakeasy secret
    twofa_enabled BOOLEAN DEFAULT FALSE,                   -- 2FA active?
    recaptcha_score DECIMAL(5,2),                          -- optional log of reCAPTCHA result
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_email ON ${DB_ABBR}_clients(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_provider_id ON ${DB_ABBR}_clients(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_role ON ${DB_ABBR}_clients(role);

-- -----------------------------
-- Admins Table (with 2FA + OAuth)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    super_admin BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}',
    provider VARCHAR(50) NOT NULL DEFAULT 'local',        -- local | google | github
    provider_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    twofa_secret VARCHAR(255),
    twofa_enabled BOOLEAN DEFAULT FALSE,
    recaptcha_score DECIMAL(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_admins_super ON ${DB_ABBR}_admins(super_admin);

-- -----------------------------
-- Refresh Tokens Table (clients only)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_refresh_tokens (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES ${DB_ABBR}_clients(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    token_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_refresh_token ON ${DB_ABBR}_refresh_tokens(token);

-- -----------------------------
-- Login History Table
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_login_history (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES ${DB_ABBR}_clients(id) ON DELETE CASCADE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    login_method VARCHAR(50) DEFAULT 'local'
);

-- -----------------------------
-- Insert Default Admin
-- -----------------------------
INSERT INTO ${DB_ABBR}_admins (username, email, password, super_admin, permissions, role)
VALUES (
    'appname',
    'admin@appname.com',
    'a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S', -- hashed
    true,
    '[4,3,2]'::jsonb,
    'admin'
);

-- -----------------------------
-- Insert Default Client
-- -----------------------------
INSERT INTO ${DB_ABBR}_clients (username, email, password, role, provider, is_verified)
VALUES (
    'appname',
    'client@appname.com',
    'a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S',
    'client',
    'local',
    true
);

EOSQL

echo "✅ All tables created successfully with 2FA, OAuth, CAPTCHA-ready schema!"
