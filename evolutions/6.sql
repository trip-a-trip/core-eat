CREATE TABLE public."collaboration_invites" (
  "code"      varchar NOT NULL,
  "author_id" varchar NOT NULL,
  "used"      boolean NOT NULL default FALSE
);

ALTER TABLE ONLY public."collaboration_invites"
  ADD CONSTRAINT "PK_invites" PRIMARY KEY (code);

CREATE TABLE public."collaboration_publish_tokens" (
  "token"   varchar NOT NULL,
  "user_id" varchar NOT NULL,
  "used"    boolean NOT NULL default FALSE
);

ALTER TABLE ONLY public."collaboration_publish_tokens"
  ADD CONSTRAINT "PK_publish_tokens" PRIMARY KEY (token);

CREATE TABLE public."collaboration_drafts" (
  "id"           varchar NOT NULL,
  "fields"       jsonb   NOT NULL,
  "approved"     boolean NOT NULL default FALSE,
  "moderated"    boolean NOT NULL default FALSE,
  "author_id"    varchar NOT NULL,
  "moderator_id" varchar
);

ALTER TABLE ONLY public."collaboration_drafts"
  ADD CONSTRAINT "PK_drafts" PRIMARY KEY (id);

CREATE TABLE public."collaboration_collaborators" (
  "user_id"    varchar                     NOT NULL,
  "sponsor_id" varchar                     NOT NULL,
  "invited_at" timestamp without time zone NOT NULL,
  "rating"     integer                     NOT NULL default 0
);

ALTER TABLE ONLY public."collaboration_collaborators"
  ADD CONSTRAINT "PK_collaborators" PRIMARY KEY ("user_id");

#DOWN

DROP TABLE public."collaboration_invites";
DROP TABLE public."collaboration_publish_tokens";
DROP TABLE public."collaboration_collaborators";
DROP TABLE public."collaboration_drafts";
