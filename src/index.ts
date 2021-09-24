import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import express from "express";
import routes from "./routes/index";

const app = express();

app.use(routes);
app.use(express.json());

const port = process.env.APP_PORT || "8080";
app.listen(port, () => {
    console.log("start application successfully");
    console.log(`application is running on port ${port}`);
});
