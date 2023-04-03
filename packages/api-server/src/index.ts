import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "./routes";
import "dotenv/config";
import cors from '@fastify/cors';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

  server.register(routes);
  server.register(cors, { origin: '*' });

server.get("/", (request, reply) => {
  reply.send({ heart: "beats" });
});

const start = async () => {
  try {
    await server.listen({
      host: "0.0.0.0",
      port: 8001,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
