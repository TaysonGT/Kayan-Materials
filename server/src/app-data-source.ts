import { DataSource } from "typeorm";
import dotenv from "dotenv";
// import {readFileSync} from 'fs'

dotenv.config();

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT||'21756'),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    entities: [__dirname + "/entity/*.{js,ts}"],
    synchronize: process.env.NODE_ENV ==='production'? false: true,
    subscribers: [],
    migrations: [],
})