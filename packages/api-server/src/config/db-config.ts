import { Pool } from "pg";

export const pg = new Pool({
  host: "localhost",
  user: "lacolico",
  password: "1q2w3e4r!",
  database: "eth-db",
  port: 5432,
});

// amz-erp
const pgRemote = new Pool({
  host: "db.erp.koreaats.com",
  user: "root",
  password: "1q2w3e4r!",
  database: "postgres",
  port: 14003,
});

// rito local
const pgLocal = new Pool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "erp",
  port: 25432,
});

// 현재 연결
export const pgCurrent = pgLocal;