ALTER TABLE public."venues"
    ADD "links" jsonb DEFAULT '[]';

#DOWN

ALTER TABLE public."venues"
    DROP COLUMN "links";
