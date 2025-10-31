import { db } from "@/db/index.js";
import { modelCategories, models, suggestionQuestions } from "@/db/schema.js";
import { BadRequestError, InternalRequestError } from "@/utils/errors.js";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

export const addModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, modelName, modelSlug } = req.body;

    if (!categoryId || !modelName || !modelSlug) {
      return next(new BadRequestError({ name: "BadRequestError", message: "All fields are required" }));
    }

    const category = await db.query.modelCategories.findFirst({
      where: (modelCategories, { eq }) => eq(modelCategories.id, categoryId)
    })

    if (!category) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Category not found" }));
    }

    await db.insert(models).values({
      name: modelName,
      slug: modelSlug,
      categoryId,
    })

    res.status(200).json({ success: true, message: "Model added successfully" })
  } catch (error) {
    console.error("addModel error", error)
    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }))
  }
}

export const addModelCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryName, categorySlug } = req.body;

    if (!categoryName || !categorySlug) {
      return next(new BadRequestError({ name: "BadRequestError", message: "All fields are required" }));
    }

    await db.insert(modelCategories).values({
      name: categoryName,
      slug: categorySlug,
    })

    res.status(200).json({ success: true, message: "Category added successfully" })
  } catch (error) {
    console.error("addModelCategory error", error)
    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }))
  }
}

export const deleteModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.params;

    if (!modelId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Model ID is required" }));
    }

    await db.delete(models).where(eq(models.id, modelId))

    res.status(200).json({ success: true, message: "Model deleted successfully" })
  } catch (error) {
    console.error("deleteModel error", error)
    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }))
  }
}

export const deleteModelCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Category ID is required" }));
    }

    db.transaction(async (tx) => {
      await tx.delete(models).where(eq(models.categoryId, categoryId))
      await tx.delete(modelCategories).where(eq(modelCategories.id, categoryId))
    })

    res.status(200).json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    console.error("deleteModelCategory error", error)
    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }))
  }
}

export const getModelsWithCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modelsData = await db.query.modelCategories.findMany({
      columns: {
        id: true,
        name: true,
        slug: true
      },
      with: {
        models: {
          columns: {
            id: true,
            categoryId: true,
            isActive: true,
            isDefault: true,
            isPremium: true,
            name: true,
            slug: true
          }
        }
      }
    })

    res.status(200).json({ success: true, data: modelsData })
  } catch (error) {
    console.error("getModelsWithCategories error", error)
    return next(new InternalRequestError({ message: "Internal server error", name: "InternalRequestError" }))
  }
}

export const updateSuggestionsQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return next(new BadRequestError({ name: "BadRequestError", message: "Data is required and must be an array" }));
    }

    for (const item of data) {
      if (!item.id || !item.questions || !Array.isArray(item.questions) || item.questions.length === 0) {
        return next(new BadRequestError({ name: "BadRequestError", message: "Each item must have an id and questions array" }));
      }
    }

    const updatedPromises = data.map(item =>
      db.update(suggestionQuestions).set({
        questions: item.questions
      }).where(eq(suggestionQuestions.id, item.id))
    )

    await Promise.all(updatedPromises)

    res.status(200).json({ success: true, message: "Questions updated successfully" })
  } catch (error) {
    console.error("updateSuggestionsQuestions error", error);
    return next(new InternalRequestError({ message: "Database query failed", name: "InternalRequestError" }))
  }
}

