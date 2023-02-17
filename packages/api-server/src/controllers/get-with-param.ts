import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
import { pg, pgCurrent } from "../config/db";

// ======================= 변동 =================================
interface IInput {
    value: number;
}

interface IQueryOutput {
    first : number;
    second: number;
}

// ======================= 고정 =================================
type ErrorString = string;

interface IOutput {
    result: IQueryOutput[] | ErrorString;
}

interface IFastifyIO  extends RouteGenericInterface {
    Params: IInput;
    Reply: IOutput;
}

// ==============================================================
async function controllerBody(input: IInput): Promise<IOutput> {

    const qr = await pgCurrent.query<IQueryOutput>(
    `
        SELECT gs * ${input.value} as first,
               gs * ${input.value} as second

          FROM GENERATE_SERIES(1, 2) AS gs
    `);

    console.log(qr.rows);

    return {
        result: qr.rows
    };
}

export async function cGetWithParam(
  request: FastifyRequest<{ Params: IInput }>,
  reply: FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IFastifyIO
  >
) {
    try {
      const result = await controllerBody(request.params);
      reply.send(result);
  
    } catch (error: any) {

      reply.send({
        result: `${error}`
      });
    }
}