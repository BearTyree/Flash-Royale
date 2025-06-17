import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("User", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
});

export const cardSetsTable = sqliteTable("CardSet", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cards: text("data", { mode: "json" }).notNull(),
  ownerId: integer("ownerId")
    .notNull()
    .references(() => usersTable.id),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  cardSets: many(cardSetsTable),
}));

export const cardSetsRelations = relations(cardSetsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [cardSetsTable.ownerId],
    references: [usersTable.id],
  }),
}));
