// import { dbTest } from "controllers/db-test";
// import { cGetUser, cGetWithParam, cGetWithQuery, cPostWithBody } from "../controllers";

import { FastifyInstance } from "fastify";
import * as Controllers from "../controllers";

export default function routes(server: FastifyInstance, opts: any, next: any) {

  server.get("/user", Controllers.getUser);
  server.get("/user2", Controllers.getUser2);
  server.get("/user3", Controllers.getUser3);

  next();
}
