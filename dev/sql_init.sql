CREATE EXTENSION IF NOT EXISTS dblink;
CREATE OR REPLACE FUNCTION create_database_if_not_exists(dbname text) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = dbname
    )
    THEN
        PERFORM dblink_exec('dbname=postgres', FORMAT('CREATE DATABASE %I', dbname));
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create 'vip' database if it doesn't exist
SELECT create_database_if_not_exists('bardo_app');

-- Create 'vip_testing' database if it doesn't exist
SELECT create_database_if_not_exists('bardo_app_testing');
