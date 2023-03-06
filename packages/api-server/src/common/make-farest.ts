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
//     uri에 자동으로 붙여주도록 구현
// ===========================================================
import { FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, FastifyInstance } from "fastify";
// import { extractRouteNode } from "../routes/route-tree-extractor";
// import { RouteNode } from "../routes/route-tree";
import { ApiResponse, RestMethod, UriString } from "./common-types";

type GenReply<O> = {
    Reply: ApiResponse<O>;
};

type GenRequestInside<RM extends RestMethod, I> = 
    RM extends 'Get-param' ? { Params     : I } :
    RM extends 'Get-query' ? { Querystring: I } :
    RM extends 'Post'      ? { Body       : I } :
    RM extends 'Put'       ? { Body       : I } :
    RM extends 'Patch'     ? { Body       : I } :
    RM extends 'Delete'    ? { Body       : I } :
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
                result: undefined,
                error: `${error}`
            });
          }
      }

      return controller;
}

// Overrides
/** 
 * API 세부 내용 정의
 * @param rm ***Get-param***: '/URI/param' 형태로 호출하는 GET Method, ***Get-query***: '/URI?query=&' 형태로 호출하는 GET Method, ***Post*** | ***Put***: Body를 사용하는 Method
 * @param controllerBody API 호출 시 동작할 컨트롤러 함수.  `async (input) => { return ApiResponse<O> }` 형태로 작성한다. 
 * @param paramUri ***rm***을 'Get-param'으로 설정했을 때만 작성한다. 쿼리 입력 타입의 키 이름을 명시한다.
 * @returns-{@link FarestFrameDefine}
 */
export function makeFarestFrame<I, O>(rm: 'Get-param', controllerBody: GenFarestBody<I, O>, paramUri: keyof I) : FarestFrameDefine<RestMethod, I, O>;
export function makeFarestFrame<I, O>(rm: 'Get-query' | 'Post' | 'Put' | 'Patch' | 'Delete', controllerBody: GenFarestBody<I, O>) : FarestFrameDefine<RestMethod, I, O>;

// Implement
// 각 컨트롤러에서 호출, 컨트롤러 프레임 생성
export function makeFarestFrame<I, O>(rm: RestMethod, controllerBody: GenFarestBody<I, O>, paramUri?: keyof I) : FarestFrameDefine<RestMethod, I, O>
{

    if(rm === 'Get-param' && (paramUri === undefined) ) {
        throw new Error('Get-Param Method Must Define URI Parameter');
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

// 라우트 등록
/**
 * API 라우트를 등록한다. 'routes/index.ts/route()' 내에서 호출한다.
 * @param server {@link FastifyInstance}
 * @param uri '/abc/def' 꼴의 URL 주소
 * @param farFrame {@link makeFarestFrame}의 리턴값을 전달한다.
 */
export function routeFarest<RM extends RestMethod, I, O>(server: FastifyInstance, uri:UriString, farFrame: FarestFrameDefine<RM, I, O>) {

    // const uri = extractRouteNode(routeTree);
    const farestUri = `${uri}${farFrame.uriParam}`;
    const farestFunc = (farFrame.controller as any) as (request: FastifyRequest, reply: FastifyReply) => void;
  
    switch(farFrame.rm) {
        case 'Get-param':
        case 'Get-query':
            server.get(farestUri, farestFunc);
            break;
  
        case 'Post':
            server.post(farestUri, farestFunc);
            break;
  
        case 'Put':
            server.put(farestUri, farestFunc);
            break;
  
        case 'Patch':
            server.patch(farestUri, farestFunc);
            break;
  
        case 'Delete':
            server.delete(farestUri, farestFunc);
            break;
    }
  }