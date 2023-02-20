import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
import { pg, pgCurrent } from "../../config/db-config";

// ======================= 변동 =================================
interface IBody {
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
    Body: IBody;
    Reply: IOutput;
}

// ===================== 컨트롤러 구현 ==========================
async function controllerBody(input: IBody): Promise<IOutput> {

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

// ===================== 컨트롤러 전달 ==========================
export async function cPostWithBody(
  request: FastifyRequest<{ Body:IBody }>,
  reply: FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IFastifyIO
  >
) {
    console.log(request.body);

    try {
        console.log(request.query);

        const result = await controllerBody(request.body);
        reply.send(result);
  
    } catch (error: any) {

      reply.send({
        result: `${error}`
      });
    }
}
