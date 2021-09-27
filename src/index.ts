import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/../.env' });

import express from "express";
import routes from "./routes/index";
import cors from 'cors';

// shared service
import {handler as errorHandler} from "groupo-shared-service/apiutils/errors";
import {LoggingGrpcClient} from "groupo-shared-service/grpc/client";

// init datasource
import {initMySQLConnection} from "groupo-shared-service/datasource/mysql";
initMySQLConnection(__dirname + "/models/*.ts");

// init logger
import {logger, registerApplicationLogger, handler as grpcHandler} from "groupo-shared-service/services/logger";
import {httpLogger, prepareHttpLogger} from "groupo-shared-service/apiutils/middleware";
registerApplicationLogger("user-service");

const app = express();

// pipeline request
app.use(cors());
app.use(prepareHttpLogger);
app.use(express.json());
app.use(routes);
app.use(httpLogger);
app.use(errorHandler);

// start server
const port = process.env.APP_PORT || "8080";
app.listen(port, () => {
    LoggingGrpcClient.Info(logger.message("start groupo-user successfully").proto(), grpcHandler);
    LoggingGrpcClient.Info(logger.set("APP_PORT", port).message("groupo-user is running").proto(), grpcHandler);
});
