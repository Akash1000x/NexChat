import { seed } from "drizzle-seed";
import { users, threads, messages } from "./schema.js";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const Threads = [
  "drizzle-seed",
  "greeting",
  "spel check",
  "example",
  "how to install arc linux in hp laptop",
  "how to add a screen in the laptop",
];

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log("Clearing existing data...");
  // Clear tables
  await db.delete(messages);
  await db.delete(threads);
  await db.delete(users);

  const insertedUser = await db
    .insert(users)
    .values({
      name: `test user`,
      email: `test@gmai.com`,
      role: "user",
      profilePictureUrl: null,
      premium: false,
      tokensUsed: 0,
      selectedModel: null,
    })
    .returning({ id: users.id });

  const insertedThreads = await db
    .insert(threads)
    .values(
      Array.from({ length: 20 }).map((_, i) => ({
        userId: insertedUser[0]?.id,
        title: Threads[i % 7],
      }))
    )
    .returning({ id: threads.id });

  type InsertMessage = typeof messages.$inferInsert;

  await db.insert(messages).values(
    insertedThreads.flatMap<InsertMessage>((id) => {
      return Array.from({ length: 10 }).map((_, i) => ({
        threadId: id.id,
        role: i % 2 === 0 ? "user" : "assistant",
        parts: [
          {
            type: "text",
            text:
              i % 3 === 0
                ? "The sun set behind the mountains, painting the sky in hues of orange and purple."
                : i % 3 === 1
                ? "The rain tapped gently on the window, a soothing rhythm against the quiet night."
                : "A cool breeze carried the scent of jasmine through the quiet village street.",
          },
        ],
      }));
    })
  );
}

main();
