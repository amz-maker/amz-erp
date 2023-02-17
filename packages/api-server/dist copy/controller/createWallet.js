"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheme_1 = require("../config/scheme");
async function getHandler(request, reply) {
    try {
        const result = await scheme_1.pg.query("SELECT * FROM users WHERE id = $1", [
            request.params.id,
        ]);
        reply.send(result.rows[0]);
    }
    catch (error) {
        reply.send(error);
    }
}
function default_1(fastify) {
    fastify.get("/users/:id", getHandler);
}
exports.default = default_1;
//# sourceMappingURL=createWallet.js.map