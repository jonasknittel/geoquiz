import express from "express";
import { PORT } from './secrets.js';
import rootRouter from "./routes/rootRoutes.js";
const app = express();
app.use('/api', rootRouter);
app.listen(PORT, () => {
    console.log('App running on port 3000');
});
//# sourceMappingURL=index.js.map