// import { dbTest } from "controllers/db-test";
import { FastifyInstance } from "fastify";
import { cGetWithParam, cGetWithQuery } from "../controllers";

export default function routes(server: FastifyInstance, opts: any, next: any) {

  server.get("/param/:value", cGetWithParam);
  server.get("/query", cGetWithQuery);
  server.post()
  next();
}
