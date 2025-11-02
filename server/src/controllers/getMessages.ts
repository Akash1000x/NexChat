import type { NextFunction, Request, Response } from "express";
import { db } from "../db/index.js";
import { messages } from "../db/schema.js";
import { asc, eq } from "drizzle-orm";
import { BadRequestError, InternalRequestError } from "../utils/errors.js";

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { threadId } = req.query;
    if (!threadId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Thread 'id' is required" }));
    }

    const messagesData = await db
      .select({
        id: messages.id,
        role: messages.role,
        parts: messages.parts,
        model: messages.model
      })
      .from(messages)
      .where(eq(messages.threadId, String(threadId)))
      .orderBy(asc(messages.createdAt));

    res.status(200).json({ success: true, data: messagesData });
  } catch (error) {
    console.error("getMessages error", error)
    return next(
      new InternalRequestError({
        message: "Database query failed",
        name: "InternalRequestError"
      })
    )
  }
};
