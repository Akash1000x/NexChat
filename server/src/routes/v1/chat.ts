import { Router } from "express";
import { streamData } from "@/controllers/chat.js";
import { getThreads } from "@/controllers/getThreads.js";
import { getMessages } from "@/controllers/getMessages.js";
import { getModels } from "@/controllers/getModels.js";
import { newConversation } from "@/controllers/newConversation.js";
import { deleteConversation } from "@/controllers/delete-conversation.js";
import { authMiddleware } from "@/utils/authmiddleware.js";

const chatRouter: Router = Router();

chatRouter.post("/", authMiddleware, streamData);
chatRouter.get("/get-threads", authMiddleware, getThreads);
chatRouter.get("/get-messages", authMiddleware, getMessages);
chatRouter.post("/new", authMiddleware, newConversation)
chatRouter.delete("/delete-conversation", authMiddleware, deleteConversation)
chatRouter.get("/get-models", getModels);

export default chatRouter;
