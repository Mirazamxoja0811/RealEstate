-- Database Initialization Script
-- Enables PostGIS extension for geolocation search & indexing

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL initialized with uuid-ossp and postgis extensions for RealEstate CRM';
END $$;
