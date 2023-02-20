// import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
// import { pg, pgCurrent } from "../../config/db";

// // ======================= 변동 =================================
// // GET 입력: 파라미터(/)
// interface IInputParam {
//     value: number;
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
//     Params: IInputParam;
//     Reply: IOutput;
// }

// // ===================== 컨트롤러 구현 ==========================
// async function controllerBody(input: IInputParam): Promise<IOutput> {

//     const qr = await pgCurrent.query<IQueryReturn>(
//     `
//         SELECT gs * ${input.value} as first,
//                gs * ${input.value} as second

//           FROM GENERATE_SERIES(1, 2) AS gs
//     `);

//     console.log(qr.rows);

//     return {
//         result: qr.rows
//     };
// }

// // ===================== 컨트롤러 전달 ==========================
// export async function cGetWithParam(
//   request: FastifyRequest<{ Params: IInputParam }>,
//   reply: FastifyReply<
//     RawServerDefault,
//     RawRequestDefaultExpression,
//     RawReplyDefaultExpression,
//     IFastifyIO
//   >
// ) {
//     try {
//       const result = await controllerBody(request.params);
//       reply.send(result);
  
//     } catch (error: any) {

//       reply.send({
//         result: `${error}`
//       });
//     }
// }