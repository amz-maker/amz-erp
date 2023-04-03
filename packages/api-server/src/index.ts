import fastify, { FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import routes from "./routes";
import "dotenv/config";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

server.register(routes, { origin: '*' });

server.get("/", (request, reply) => {
  reply.send({ heart: "beats" });
});

const start = async () => {
  try {
    await server.listen({
      port: Number(process.env.PORT_NUMBER!),
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
