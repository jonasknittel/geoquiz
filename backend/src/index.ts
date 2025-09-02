import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from './secrets.js';
import rootRouter from "./routes/rootRoutes.js";
import { checkUser } from "./middleware/checkUser.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(checkUser);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use('/api', rootRouter);

app.listen(PORT, () => {
    console.log('App running on port 3000');
});