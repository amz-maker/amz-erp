import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { pg } from "../config/scheme";

interface UserParams {
  id: string;
}

export async function createWallet(
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply
) {
  try {
    const result = await pg.query("SELECT * FROM users WHERE id = $1", [
      request.params.id,
    ]);
    reply.send(result.rows[0]);
  } catch (error) {
    reply.send(error);
  }
}
