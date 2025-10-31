import type { NextFunction, Request, Response } from "express";
import { InternalRequestError } from "@/utils/errors.js";
import { db } from "@/db/index.js";

export const GetSuggestionsQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await db.query.suggestionQuestions.findMany({
      columns: {
        id: true,
        category: true,
        questions: true
      }
    })


    res.status(200).json({ success: true, data: questions })
  } catch (error) {
    console.error("GetSuggestionsQuestions error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}