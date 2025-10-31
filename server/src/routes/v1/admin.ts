import { Router } from 'express'
import { addModel, addModelCategory, deleteModel, deleteModelCategory, getModelsWithCategories, updateSuggestionsQuestions } from '@/controllers/admin.js'

const adminRouter: Router = Router();

adminRouter.post("/add-model", addModel)
adminRouter.post("/add-model-category", addModelCategory)
adminRouter.delete("/delete-model/:modelId", deleteModel)
adminRouter.delete("/delete-model-category/:categoryId", deleteModelCategory)
adminRouter.get("/get-models", getModelsWithCategories)
adminRouter.put("/update-suggestions-questions", updateSuggestionsQuestions)

export default adminRouter;