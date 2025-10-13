import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.json());

app.use("/api", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error("error", err)
  res.status(err.status || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
    }
  })
})


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
