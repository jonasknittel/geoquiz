import express from "express";
import type { Request, Response } from "express";
import { PORT } from './secrets.js';
import rootRouter from "./routes/rootRoutes.js";

const app = express();

app.use(express.json());

app.use('/api', rootRouter);

app.listen(PORT, () => {
    console.log('App running on port 3000');
});