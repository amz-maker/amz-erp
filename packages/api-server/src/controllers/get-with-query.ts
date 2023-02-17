import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
import { pg, pgCurrent } from "../config/db";

// ======================= 변동 =================================
// interface IParam {
//     value: number;
// }

interface IQuery {
    a: number;
    b: number;
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
    // Params: IParam;
    Querystring: IQuery;
    Reply: IOutput;
}

// ==============================================================
async function controllerBody(input: IQuery): Promise<IOutput> {

    const qr = await pgCurrent.query<IQueryOutput>(
    `
        SELECT gs * ${input.a} as first,
               gs * ${input.b} as second

          FROM GENERATE_SERIES(1, 2) AS gs
    `);

    console.log(qr.rows);

    return {
        result: qr.rows
    };
}

export async function cGetWithQuery(
  request: FastifyRequest<{ Querystring:IQuery }>,
  reply: FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IFastifyIO
  >
) {
    try {
        const result = await controllerBody(request.query);
        reply.send(result);
  
    } catch (error: any) {

      reply.send({
        result: `${error}`
      });
    }
}
