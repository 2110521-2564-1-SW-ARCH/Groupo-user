import {Connection, createConnection} from "typeorm";
import {ApplicationLogger} from "groupo-shared-service/logging/logger";

let connection: Connection | null = null;

let logger = new ApplicationLogger();

export const getConnection = async (): Promise<Connection> => {
    logger = logger.field("host", process.env.MYSQL_HOST).field("user", process.env.MYSQL_USER);

    if (connection === null) {
        logger.info("connecting to mysql");
        try {
            connection = await createConnection({
                type: "mysql",
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
                username: process.env.MYSQL_USER || "root",
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DB,
                entities: [__dirname + "/../models/*.ts"],
                synchronize: true,
                logging: false,
            });
        } catch (err) {
            logger.error(err.message);
        }
        logger.info("connect to mysql successfully");
    }
    return connection;
};
