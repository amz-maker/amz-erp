// ===========================================================
//  Fastify IO/Controller Body 제네릭 템플릿화
// ===========================================================
// - 작성일: 2023. 02. 20
// - 작성자: 홍사민
// ===========================================================

import { FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";

type ErrorString = string;
type RestMethod = 'Get-param' | 'Get-query' | 'Post-body';

type GenReplyInside<O> = {
    result: O[] | ErrorString;
};

type GenReply<O> = {
    Reply: GenReplyInside<O>;
}

type GenRequestInside<RM extends RestMethod, I> = 
    RM extends 'Get-param' ? { Params     : I } :
    RM extends 'Get-query' ? { Querystring: I } :
    RM extends 'Post-body' ? { Body       : I } :
    never
;

type GenFarestIO<RM extends RestMethod, I, O> = 
    GenRequestInside<RM, I> & 
    GenReply<O> & 
    RouteGenericInterface
;

// Controller Request Param 1
type GenFastifyRequest<RM extends RestMethod, I> = FastifyRequest<GenRequestInside<RM, I>>;

// Controller Request Param 2
type GenFastifyReply<IO extends RouteGenericInterface> = FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IO
>

export type GenFarestBody<I, O> = (input: I) => Promise<GenReplyInside<O>>;

// =================================================================
export function makeFarestController<I, O>(rm: RestMethod, controllerBody: GenFarestBody<I, O>) {
    type RM = typeof rm;
    type IO = GenFarestIO<RM, I, O>;

    const controller = async function (
        request: GenFastifyRequest<RM, I>,
        reply: GenFastifyReply<IO>
      ) {
          try {
            const result = await controllerBody(
                (rm === 'Get-param' ? request.params : 
                rm === 'Get-query' ? request.query : 
                request.body) as any
            );
            reply.send(result as any);
        
          } catch (error: any) {
      
            reply.send({
              result: `${error}`
            });
          }
      }

      return controller;
}
