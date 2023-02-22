// ===========================================================
//  Fastify IO/Controller Body 제네릭화
// ===========================================================
// - 작성일: 2023. 02. 20
// - 작성자: 홍사민
// ===========================================================
// [기록]
// 2023. 02. 22.
// - makeFarestFrame 추가
//   - Query-param 메소드에서도 쿼리 파라미터 명시 없이
//     uri에 자동으로 붙여주도록 표준 규격 완성
// ===========================================================
import { FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyInstance } from "fastify";
import { extractRouteNode } from "../routes/route-tree-extractor";
import { RouteNode } from "../routes/route-tree";
import { ApiResponse, RestMethod } from "./common-types";

type GenReply<O> = {
    Reply: ApiResponse<O>;
};

type GenRequestInside<RM extends RestMethod, I> = 
    RM extends 'Get-param' ? { Params     : I } :
    RM extends 'Get-query' ? { Querystring: I } :
    RM extends 'Post'      ? { Body       : I } :
    RM extends 'Put'       ? { Body       : I } :
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
type GenFastifyReply<IO extends RouteGenericInterface = RouteGenericInterface> = FastifyReply<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    IO
>;

export type GenFarestBody<I, O> = (input: I) => Promise<ApiResponse<O>>;

// =================================================================
function makeFarestController<I, O>(rm: RestMethod, controllerBody: GenFarestBody<I, O>) {
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

            reply.send(result);
        
          } catch (error: any) {
      
            reply.send({
                result: null,
                error: `${error}`
            });
          }
      }

      return controller;
}

// 각 컨트롤러에서 호출, 컨트롤러 프레임 생성
export function makeFarestFrame<I, O>(rm: RestMethod, paramUri: keyof I | null | undefined, controllerBody: GenFarestBody<I, O>) {

    if(rm === 'Get-param' && (paramUri === undefined || paramUri === null) ) {
        throw new Error('Get-Param Method Need to Define URI Parameter');
    }
    
    return {
        controller: makeFarestController(rm, controllerBody),
        uriParam: rm === 'Get-param' ? `/:${String(paramUri)}` : '',
        rm: rm,
    }
}

export type FarestControllerDefine<RM extends RestMethod, I, O> = (request: GenFastifyRequest<RM, I>, reply: GenFastifyReply<GenFarestIO<RM, I, O>>) => {};
export type FarestFrameDefine<RM extends RestMethod, I, O> = {
    controller: FarestControllerDefine<RM, I, O>,
    uriParam: string,
    rm: RM,
};

// 라우트에서 호출
export function farest<RM extends RestMethod, I, O>(server: FastifyInstance, routeNode:RouteNode, conFrame: FarestFrameDefine<RM, I, O>) {

    const uri = extractRouteNode(routeNode);
    const farestUri = `${uri}${conFrame.uriParam}`;
    const farestFunc = (conFrame.controller as any) as (request: FastifyRequest, reply: FastifyReply) => void;
  
    switch(conFrame.rm) {
        case 'Get-param':
        case 'Get-query':
        {
          server.get(farestUri, farestFunc);
        }
        break;
  
        case 'Post':
        {
          server.post(farestUri, farestFunc);
        }
        break;
  
        case 'Put':
        {
          server.put(farestUri, farestFunc);
        }
        break;
    }
  }