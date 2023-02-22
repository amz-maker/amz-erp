// ===========================================================
//  PG 쿼리 단순 호출 서비스 함수 생성 제네릭화
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
import { QueryResultRow } from "pg";
import { pgCurrent } from "../config/db-config";
import { ApiResponse, QueryResultFrame, QueryResultOption } from "./common-types";
import { ArrayOfKeys, GenColumnStmts, Join } from "./utility-types";

type InputStrArr<T> = ArrayOfKeys<T>;
// @ts-ignore
type ColumnsArrDefine<T> = GenColumnStmts<InputStrArr<T>>;
type BaseQueryDefine<T> = Join<ColumnsArrDefine<T>, `,`>;
// type SelectQueryDefine<T> = `${string}SELECT${BaseQueryDefine<T>}FROM${string}${('WHERE') | ''}${string}`;

export function makeQueryService<I extends object, O extends QueryResultRow>(
    queryResultOption: QueryResultOption, 
    query: BaseQueryDefine<O>
): ((input: I) => (Promise<QueryResultFrame<O>>)) 
{
    return async function<I extends {}, O extends QueryResultRow>(input: I): Promise<QueryResultFrame<O>> {

        const inputKeys = Object.keys(input);
        let queryString = query as string;

        inputKeys.map((v) => {
            queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
        });

        // console.log(input);
        // console.log(query);
        // console.log(queryString);

        const queryResult = await pgCurrent.query<O>(queryString);
        if(queryResultOption == 'One') {
            if(queryResult.rowCount > 0) {
                return queryResult.rows[0];
            }
            else {
                return null;
            }
        } else {
            return queryResult.rows;
        }
    }
}

// export function makeQueryService2<I extends object, O extends QueryResultRow>(
//     queryResultOption: QueryResultOption,
//     query: BaseQueryDefine<O>
// ): ((input: I, queryResultOption: QueryResultOption) => (Promise<O | undefined | O[]>)) 
// {
//     if(queryResultOption)

//     return async function<I extends {}, O extends QueryResultRow>(input: I, ): Promise<O | undefined | O[]> {

//         const inputKeys = Object.keys(input);
//         let queryString = query as string;

//         inputKeys.map((v) => {
//             queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
//         });

//         // console.log(input);
//         // console.log(query);
//         // console.log(queryString);

//         const queryResult = await pgCurrent.query<O>(queryString);
//         if(queryResultOption === 'One') {
//             if(queryResult.rowCount > 0) {
//                 return queryResult.rows[0];
//             }
//             else {
//                 return undefined;
//             }
//         } else {
//             return queryResult.rows;
//         }
//     }
// }

// 컨트롤러 내에서 쿼리 단독 호출 및 단순 반환하는 경우 사용
// QueryResultFrame<O> => ApiResponse<O> 변환
export function wrapQueryReturnToApiResponse<O>(queryResultType: QueryResultOption, queryResult: QueryResultFrame<O>): ApiResponse<O> {
    
    if(queryResult === null || queryResult === undefined) {
        return {
            result: null
        };
    }
    // Array
    else if(Array.isArray(queryResult)) {
        
        if(queryResultType === 'One') {
            return {
                results: queryResult,
                error: `Query must return a value, but returns array(length: ${queryResult.length})`
            };

        } else {
            return {
                results: queryResult
            };
        }
    }
    // One
    else {
        
        if(queryResultType === 'One') {
            return {
                result: queryResult
            };

        } else {
            return {
                result: queryResult,
                error: `Query must return an array, but returns a single value`
            }
        }
    }
}

// I, O, 실제 입력값 넣으면 쿼리 실행시키고 리턴하는 서비스 함수 생성
async function example() {
    
    type QueryInput = {
        id: string
    }
    type QueryOutput = {
        id: number;
        name: number;
    };
    const queryService = makeQueryService<QueryInput, QueryOutput>(
        'One',
        `
        SELECT {id} AS "id",
                200 AS "name"
        `
    );

    const ret = await queryService({ id: '123' });
}