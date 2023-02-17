"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const routes_1 = __importDefault(require("./routes"));
const server = (0, fastify_1.default)({
    logger: true,
});
server.register(routes_1.default);
server.get("/", (request, reply) => {
    reply.send({ hello: "world@" });
});
server.get("/test", (request, reply) => {
    reply.send({ test: "SS", id: "123456" });
});
const start = async () => {
    try {
        await server.listen({
            port: 8001,
        });
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map