"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pg = void 0;
const pg_1 = require("pg");
exports.pg = new pg_1.Pool({
    host: "localhost",
    user: "lacolico",
    password: "1q2w3e4r!",
    database: "eth-db",
    port: 5432,
});
//# sourceMappingURL=scheme.js.map