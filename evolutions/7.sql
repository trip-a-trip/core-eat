ALTER TABLE public."eat_venues"
    ADD "disabled" bool DEFAULT false;

#DOWN

ALTER TABLE public."eat_venues"
    DROP COLUMN "disabled";
