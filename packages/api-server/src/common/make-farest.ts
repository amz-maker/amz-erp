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

type GenRequestInside<RO extends RestMethod, I> = 
    RO extends 'Get-param' ? { Params     : I } :
    RO extends 'Get-query' ? { Querystring: I } :
    RO extends 'Post-body' ? { Body       : I } :
    never
;

type GenFarestIO<RO extends RestMethod, I, O> = 
    GenRequestInside<RO, I> & 
    GenReply<O> & 
    RouteGenericInterface
;

// Controller Request Param 1
type GenFastifyRequest<RO extends RestMethod, I> = FastifyRequest<GenRequestInside<RO, I>>;

// Controller Request Param 2
type GenFastifyReply<IO extends RouteGenericInterface> = FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IO
>

export type GenFarestBody<I, O> = (input: I) => Promise<GenReplyInside<O>>;

// =================================================================
export function makeFarestController<I, O>(ro: RestMethod, controllerBody: GenFarestBody<I, O>) {
    type RO = typeof ro;
    type IO = GenFarestIO<RO, I, O>;

    const controller = async function (
        request: GenFastifyRequest<RO, I>,
        reply: GenFastifyReply<IO>
      ) {
          try {
            const result = await controllerBody(
                (ro === 'Get-param' ? request.params : 
                ro === 'Get-query' ? request.query : 
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
