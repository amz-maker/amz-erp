"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const createWallet_1 = __importDefault(require("controller/createWallet"));
const server = (0, fastify_1.default)();
(0, createWallet_1.default)(server);
//# sourceMappingURL=main.js.map