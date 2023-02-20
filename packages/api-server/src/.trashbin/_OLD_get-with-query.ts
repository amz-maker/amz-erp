// import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
// import { pg, pgCurrent } from "../../config/db";

// // ======================= 변동 =================================
// // GET 입력 : 쿼리(?&=)
// interface IInputQuery {
//     a: number;
//     b: number;
// }

// // DB 쿼리 출력
// interface IQueryReturn {
//     first : number;
//     second: number;
// }

// // ======================= 고정 =================================
// type ErrorString = string;

// interface IOutput {
//     result: IQueryReturn[] | ErrorString;
// }

// interface IFastifyIO  extends RouteGenericInterface {
//     // Params: IParam;
//     Querystring: IInputQuery;
//     Reply: IOutput;
// }

// // ===================== 컨트롤러 구현 ==========================
// async function controllerBody(input: IInputQuery): Promise<IOutput> {

//     const qr = await pgCurrent.query<IQueryReturn>(
//     `
//         SELECT gs * ${input.a} as first,
//                gs * ${input.b} as second

//           FROM GENERATE_SERIES(1, 2) AS gs
//     `);

//     console.log(qr.rows);

//     return {
//         result: qr.rows
//     };
// }

// // ===================== 컨트롤러 전달 ==========================
// export async function cGetWithQuery(
//   request: FastifyRequest<{ Querystring:IInputQuery }>,
//   reply: FastifyReply<
//     RawServerDefault,
//     RawRequestDefaultExpression,
//     RawReplyDefaultExpression,
//     IFastifyIO
//   >
// ) {
//     try {
//         const result = await controllerBody(request.query);
//         reply.send(result);
  
//     } catch (error: any) {

//       reply.send({
//         result: `${error}`
//       });
//     }
// }
