-- ChurchFlow: cadastro de pessoas
-- Execute após a criação da tabela tenants.
CREATE TABLE IF NOT EXISTS church_people (
  id varchar(64) PRIMARY KEY,
  tenant_id varchar(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name varchar(255) NOT NULL,
  preferred_name varchar(255),
  email varchar(255),
  phone varchar(40),
  birth_date date,
  member_since date,
  category varchar(80) NOT NULL DEFAULT 'member',
  role varchar(120),
  photo_url text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_church_people_tenant ON church_people(tenant_id);
CREATE INDEX IF NOT EXISTS idx_church_people_name ON church_people(full_name);
CREATE INDEX IF NOT EXISTS idx_church_people_birth_date ON church_people(birth_date);
CREATE INDEX IF NOT EXISTS idx_church_people_active ON church_people(is_active);
