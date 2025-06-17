import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const cardSets = sqliteTable("CardSet", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cards: text("data", { mode: "json" }).notNull(),
  ownerId: integer("ownerId")
    .notNull()
    .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  cardSets: many(cardSets),
}));

export const cardSetsRelations = relations(cardSets, ({ one }) => ({
  owner: one(users, {
    fields: [cardSets.ownerId],
    references: [users.id],
  }),
}));
