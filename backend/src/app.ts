import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Deve ser o último middleware registrado
app.use(errorMiddleware);