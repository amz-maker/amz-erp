import { FastifyInstance } from "fastify";
import { createWallet } from "../controllers";

export default function routes(server: FastifyInstance, opts: any, next: any) {
  server.get("/users/:id", createWallet);
  next();
}
