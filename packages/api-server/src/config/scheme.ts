import { Pool } from "pg";

export const pg = new Pool({
  host: "localhost",
  user: "lacolico",
  password: "1q2w3e4r!",
  database: "eth-db",
  port: 5432,
});
