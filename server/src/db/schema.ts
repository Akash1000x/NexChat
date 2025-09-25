import { sql } from "drizzle-orm";
import { pgTable as table, PgArray } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at"),
};

const userRoleEnum = t.pgEnum("user_role", ["user", "admin"]);
const messageRoleEnum = t.pgEnum("message_role", ["user", "assistant"]);

export const users = table(
  "users",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: t.text("name").notNull(),
    email: t.text("email").notNull(),
    profilePictureUrl: t.text("profile_picture_url"),
    premium: t.boolean("premium").notNull().default(false),
    tokensUsed: t.integer("tokens_used").notNull().default(0),
    role: userRoleEnum("role"),
    selectedModel: t.text("selected_model"),

    ...timestamps,
  },
  (table) => ({
    emailIndex: t.uniqueIndex("email_idx").on(table.email),
  })
);

export const threads = table(
  "threads",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: t.text("user_id").references(() => users.id),
    title: t.text("title"),
    isDeleted: t.boolean("is_deleted").notNull().default(false),

    ...timestamps,
  },
  (table) => ({
    userIndex: t.uniqueIndex("user_ids").on(table.userId),
    isDeletedIndex: t.index("is_deleted_idx").on(table.isDeleted),
  })
);

export const messages = table(
  "messages",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    threadId: t.text("thread_id").references(() => threads.id),
    role: messageRoleEnum("role"),
    parts: t.json("parts").$type<
      {
        type: "text";
        text: String;
      }[]
    >(),

    ...timestamps,
  },
  (table) => ({
    threadIndex: t.index("thread_idx").on(table.threadId),
  })
);

export const usage = table("usage", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: t.text("user_id").references(() => users.id),
  tokensUsed: t.integer("tokens_used"),
  data: t.date("data").notNull(),

  ...timestamps,
});

export const modelCategorie = table("model_categorie", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  logoUrl: t.text("logo_url"),

  ...timestamps,
});

export const models = table("models", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  baseUrl: t.text("base_url").notNull(),
  apiKey: t.text("api_key").notNull(),
  isDefault: t.boolean("is_default").notNull().default(false),
  isActive: t.boolean("is_active").notNull().default(true),
  imageUrl: t.text("image_url"),
  isPremium: t.boolean("is_premium").notNull().default(true),
  category: t.text("category").references(() => modelCategorie.id),

  ...timestamps,
});
