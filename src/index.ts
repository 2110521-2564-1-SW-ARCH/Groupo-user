import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import express from "express";
import routes from "./routes/index";
import {errorHandler} from "./error";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorHandler);

const port = process.env.APP_PORT || "8080";
app.listen(port, () => {
    console.log("Started groupo-user successfully");
    console.log(`groupo-user is running on port ${port}`);
});
