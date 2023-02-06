import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "./routes";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

server.register(routes);

server.get("/", (request, reply) => {
  reply.send({ hello: "world" });
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
