USE teamup;

-- À exécuter une seule fois dans phpMyAdmin sur la base existante.
ALTER TABLE matches MODIFY COLUMN image_url LONGTEXT NULL;
ALTER TABLE matches ADD COLUMN latitude DECIMAL(10,7) NULL;
ALTER TABLE matches ADD COLUMN longitude DECIMAL(10,7) NULL;
