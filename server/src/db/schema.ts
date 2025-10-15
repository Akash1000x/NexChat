import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: t.timestamp("created_at").notNull().defaultNow(),
  updatedAt: t.timestamp("updated_at"),
};

export const userRoleEnum = t.pgEnum("user_role", ["user", "admin"]);
export const messageRoleEnum = t.pgEnum("message_role", ["user", "assistant"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("user"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const threads = pgTable(
  "threads",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: t.text("user_id").references(() => user.id),
    title: t.text("title").default("New conversation"),
    isDeleted: t.boolean("is_deleted").notNull().default(false),

    ...timestamps,
  },
  (table) => ({
    userIndex: t.index("user_ids").on(table.userId),
    isDeletedIndex: t.index("is_deleted_idx").on(table.isDeleted),
  })
);

export const messages = pgTable(
  "messages",
  {
    id: t
      .text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    threadId: t.text("thread_id").references(() => threads.id),
    role: messageRoleEnum(),
    model: t.text(),
    parts: t.json("parts").$type<
      {
        type: "text";
        text: string;
      }[]
    >(),

    ...timestamps,
  },
  (table) => ({
    threadIndex: t.index("thread_idx").on(table.threadId),
  })
);

export const usage = pgTable("usage", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: t.text("user_id").references(() => user.id),
  tokensUsed: t.integer("tokens_used"),
  data: t.date("data").notNull(),

  ...timestamps,
});

export const modelCategories = pgTable("model_categories", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull(),
  apiKey: t.text("api_key").notNull(),
  baseUrl: t.text("base_url"),

  ...timestamps,
});


export const models = pgTable("models", {
  id: t
    .text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull(),
  isDefault: t.boolean("is_default").notNull().default(false),
  isActive: t.boolean("is_active").notNull().default(true),
  isPremium: t.boolean("is_premium").notNull().default(true),
  categoryId: t.text("category_id").references(() => modelCategories.id),

  ...timestamps,
});


export const modelCategoriesRelations = relations(modelCategories, ({ many }) => ({
  models: many(models)
}))

export const modelsRelations = relations(models, ({ one }) => ({
  category: one(modelCategories, {
    fields: [models.categoryId],
    references: [modelCategories.id]
  })
}))

export const suggestionQuestions = pgTable("suggestion_questions", {
  id: t.text("id").primaryKey().default(sql`gen_random_uuid()`),
  category: t.text().default(""),
  questions: t.json("questions").$type<string[]>(),

  ...timestamps
})
