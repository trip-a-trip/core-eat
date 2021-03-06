CREATE TABLE public.venues (
  "id"           varchar NOT NULL,
  "name"         varchar NOT NULL,
  "description"  varchar          default NULL,
  "address"      varchar          default NULL,
  "is_expensive" boolean NOT NULL default FALSE,
  "is_amazing"   boolean NOT NULL default FALSE,
  "kind"         text[]  NOT NULL,
  "latitude"     float   NOT NULL,
  "longitude"    float   NOT NULL
);

ALTER TABLE ONLY public.venues
  ADD CONSTRAINT "PK_venues" PRIMARY KEY (id);

CREATE TABLE public.seen (
  "user_id"  varchar                     NOT NULL,
  "venue_id" varchar                     NOT NULL,
  "date"     timestamp without time zone          default NULL
);

ALTER TABLE ONLY public.seen
  ADD CONSTRAINT "PK_seen" PRIMARY KEY ("user_id", "venue_id", "date");

#DOWN

DROP TABLE public.venues;
DROP TABLE public.seen;
