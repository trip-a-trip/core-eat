CREATE TABLE public."user_users" (
  "id" varchar NOT NULL
);

ALTER TABLE ONLY public."user_users"
  ADD CONSTRAINT "PK_users" PRIMARY KEY (id);

#DOWN

DROP TABLE public."user_users";