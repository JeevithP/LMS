import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "../server/routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import courseRoute from "../server/routes/course.route.js";
import mediaRoute from "../server/routes/media.route.js";
import purchaseCourseRoute from "../server/routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config();
connectDb();

const app = express();
const port = process.env.PORT;

// 👉 First: Cookie and CORS setup
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// 👉 SPECIAL: Raw body only for Stripe Webhook
app.use("/api/v1/purchase/webhook", express.raw({ type: "application/json" }));

// 👉 All other JSON parsing AFTER webhook
app.use(express.json());

// 👉 Routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseCourseRoute);
app.use("/api/v1/progress", courseProgressRoute);

// 👉 Start Server
app.listen(port, () => {
  console.log("Server is running at Port number:", port);
});
