ALTER TABLE public."venues"
    ADD "author_id" varchar DEFAULT NULL;

#DOWN

ALTER TABLE public."venues"
    DROP COLUMN "author_id";
