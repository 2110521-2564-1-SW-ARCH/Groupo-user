import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import express from "express";
import routes from "./routes/index";
import cors from 'cors';
import {handler} from "groupo-shared-service/apiutils/errors";
import {ApplicationLogger} from "groupo-shared-service/logging/logger";

const app = express();
const logger = new ApplicationLogger();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(handler);

const port = process.env.APP_PORT || "8080";
app.listen(port, () => {
    logger.info("start groupo-user successfully");
    logger.field("application-port", port).info("groupo-user is running");
});