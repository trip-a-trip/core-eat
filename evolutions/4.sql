ALTER TABLE "venues" RENAME TO "eat_venues";
ALTER TABLE "seen" RENAME TO "eat_seen";

#DOWN

ALTER TABLE "eat_venues" RENAME TO "venues";
ALTER TABLE "eat_seen" RENAME TO "seen";
