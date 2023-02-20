// import { dbTest } from "controllers/db-test";
// import { cGetUser, cGetWithParam, cGetWithQuery, cPostWithBody } from "../controllers";

import { FastifyInstance } from "fastify";
import * as Controllers from "../controllers";

export default function routes(server: FastifyInstance, opts: any, next: any) {

  // TEMPLATES =====================================
  // server.get("/param/:value", cGetWithParam);
  // server.get("/query",        cGetWithQuery);
  // server.post("/post",        cPostWithBody);
  // ===============================================

  server.get("/user", Controllers.cGetUser);

  next();
}
