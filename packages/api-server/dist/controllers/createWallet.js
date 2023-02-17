"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = void 0;
const scheme_1 = require("../config/scheme");
async function createWallet(request, reply) {
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
exports.createWallet = createWallet;
//# sourceMappingURL=createWallet.js.map