

import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  path: text("path").notNull(), 
  size: integer("size").notNull(), 
  type: text("type").notNull(), 

  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"), 

  userId: text("user_id").notNull(), 
  parentId: uuid("parent_id"), 

  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(), 

  isPublic: boolean("is_public").default(false).notNull(),
  sharePassword: text("share_password"),
  shareExpiresAt: timestamp("share_expires_at"),
  shareId: text("share_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId], 
    references: [files.id], 
  }),

  children: many(files),

  shares: many(fileShares),
}));

export const fileShares = pgTable("file_shares", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileId: uuid("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  password: text("password"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  accessCount: integer("access_count").default(0).notNull(),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export const fileSharesRelations = relations(fileShares, ({ one }) => ({
  file: one(files, {
    fields: [fileShares.fileId],
    references: [files.id],
  }),
}));


export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;

export type FileShare = typeof fileShares.$inferSelect;
export type NewFileShare = typeof fileShares.$inferInsert;
