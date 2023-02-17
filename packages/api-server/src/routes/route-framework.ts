//TODO: 프레임워크 구조 잡기

// // import { dbTest } from "controllers/db-test";
// import { FastifyInstance, FastifyReply, FastifyRequest, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface } from "fastify";
// import { cDbTest } from "../controllers";

// export default function routes(server: FastifyInstance, opts: any, next: any) {
//   // server.get("/users/:id", createWallet);
//   next();
//   server.get("/db/:value", cDbTest);
// }


// interface IFarestInput {}
// interface IFarestOutput {}
// interface IFarestIO<I extends IFarestInput, O extends IFarestOutput>  extends RouteGenericInterface {
//     Params: I;
//     Reply: O;
// }
// type FarestBody = (i: IFarestInput) => IFarestOutput | Promise<IFarestOutput>;

// interface IFarestModule {
//     api: string,
//     input: IFarestInput;
//     output: IFarestOutput;

//     body: FarestBody;
// }

// export async function farestGetWrapper<I extends IFarestInput, O extends IFarestOutput>(
//     request: FastifyRequest<{ Params: IUserInput }>,
//     reply: FastifyReply<
//       RawServerDefault,
//       RawRequestDefaultExpression,
//       RawReplyDefaultExpression,
//       IFarestIO<I, O>
//     >
//   ) {
//       try {
//         const result = await userController(request.params);
//         reply.send(result);
    
//       } catch (error) {
  
//         reply.send({
//           result: 'error'
//         });
//       }
//   }

// function fastifyGet(
//     server: FastifyInstance, 
//     apiName: string, 
//     body: FarestBody
// ) {
//     server.get("/db/:value", body);
// }

// // ================================================================================= User ==
// interface IUserInput extends IFarestInput {
//     id: string;
// }
// interface IUserOutput {
//     value: string;
// }

// async function userController(i: IUserInput): Promise<IUserOutput> {

//     return {
//         value: 'abab'
//     }
// }

// /*

// fastifyGet(server, 'user', userController);
// fastifyGet(server, 'search', searchController);

// function userController(i: IFarestInput): Promise<IFarestOutput> {

// }


// */