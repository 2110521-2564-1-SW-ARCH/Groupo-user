import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import express from "express";
import routes from "./routes/index";
import cors from 'cors';

// shared service
import {handler} from "groupo-shared-service/apiutils/errors";

// init datasource
import {initMySQLConnection} from "groupo-shared-service/datasource/mysql";
initMySQLConnection(__dirname + "/models/*.ts");

// init logger
import {logger, registerApplicationLogger} from "groupo-shared-service/logging/logger";
registerApplicationLogger("user-service");

const app = express();

// pipeline request
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(handler);

// start server
const port = process.env.APP_PORT || "8080";
app.listen(port, () => {
    logger.info("start groupo-user successfully");
    logger.field("application-port", port).info("groupo-user is running");
});
