CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340;


-- create relationship between 'classification' and 'inventory' tables
ALTER TABLE IF EXISTS public.inventory
	ADD CONSTRAINT fk_classification FOREIGN KEY (classificaTion_id)
	REFERENCES public.classification (classification_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE NO ACTION;