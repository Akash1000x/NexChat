import { Router } from "express";
import chatRouter from "./chat.js";
import { GetSuggestionsQuestions } from "@/controllers/getSuggestionsQuestions.js";
import adminRouter from "./admin.js";

const router: Router = Router();

router.use("/chat", chatRouter);
router.get("/get-suggestions-questions", GetSuggestionsQuestions);
router.use("/admin", adminRouter);
export default router;
