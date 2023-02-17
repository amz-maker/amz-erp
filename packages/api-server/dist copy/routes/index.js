"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
function routes(server, opts, next) {
    server.get("/users/:id", controllers_1.createWallet);
    next();
}
exports.default = routes;
//# sourceMappingURL=index.js.map