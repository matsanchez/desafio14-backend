import dotenv from "dotenv";

dotenv.config();

export const configDbLocal = {
  host: process.env.DB_LOCAL_HOST,
  user: process.env.DB_LOCAL_USER,
  password: process.env.DB_LOCAL_PWD,
};

export const configMysql = {
  client: "mysql",
  connection: {
    host: process.env.DB_MYSQL_HOST,
    user: process.env.DB_MYSQL_USER,
    password: process.env.DB_MYSQL_PWD,
    database: process.env.DB_MYSQL_DATABASE,
  },
  pool: { min: 0, max: 7 },
};

export const configSqlite = {
  client: "sqlite3",
  connection: {
    filename: "./src/db/ecommerce.sqlite",
  },
  useNullAsDefault: true,
};
