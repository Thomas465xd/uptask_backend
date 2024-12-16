import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRoutes";
import morgan from "morgan";

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig));

// Logging
app.use(morgan("dev"));

// Leer datos de formularios
app.use(express.json())

// Routes
app.use("/api/projects", projectRouter);

export default app