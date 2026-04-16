import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const databasePath = process.env.DATABASE_PATH || __dirname + '/../../database/db.sqlite';

export const myDataSource = new DataSource({
    type: "better-sqlite3",
    database: databasePath,
    entities: [__dirname + "/entity/*.{js,ts}"],
    synchronize: true,
    subscribers: [],
    migrations: []
})