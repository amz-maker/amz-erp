// ===========================================================
//  PG 쿼리 단순 호출 서비스 함수 생성 제네릭화
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
import { QueryResult, QueryResultRow } from "pg";
import { pgCurrent } from "../config/db-config";
import { ReturnCardinality } from "../common-types/common";
import { ArrayOfKeys, GenColumnStmts, Join } from "../common-types/utility";

type InputStrArr<T> = ArrayOfKeys<T>;
// @ts-ignore
type ColumnsArrDefine<T> = GenColumnStmts<InputStrArr<T>>;
type BaseQueryDefine<T> = Join<ColumnsArrDefine<T>, `,`>;
// type SelectQueryDefine<T> = `${string}SELECT${BaseQueryDefine<T>}FROM${string}${('WHERE') | ''}${string}`;

// Override 1
/**
 * SQL 쿼리 I/O 타입 및 쿼리 스트링을 기반으로, 호출 가능한 서비스 함수 생성
 * @param returnCardinality ***MustOne***: 반드시 1개 행만 리턴 / ***ZeroOrOne***: 1개 또는 0개 행 리턴 / ***Many***: 0~N개 행 리턴(배열)
 * @param query SQL 쿼리문 스트링. 출력 타입에 정의한 오브젝트 키들의 이름이 스트링 내에 "name" 형태로 작성되어야 한다.
 */
export function makeQueryService<I extends {}, O extends QueryResultRow>(
    returnCardinality: 'MustOne',
    query: BaseQueryDefine<O>
): ((input: I) => (Promise<O>)); // MustOne

// Override 2
export function makeQueryService<I extends {}, O extends QueryResultRow>(
    returnCardinality: 'ZeroOrOne',
    query: BaseQueryDefine<O>
): ((input: I) => (Promise<undefined | O>)); // ZeroOrOne

// Override 3
export function makeQueryService<I extends {}, O extends QueryResultRow>(
    returnCardinality: 'Many',
    query: BaseQueryDefine<O>
): ((input: I) => (Promise<O[]>)); // Many

// Implement
export function makeQueryService<I extends {}, O extends QueryResultRow>(
    returnCardinality: ReturnCardinality,
    query: BaseQueryDefine<O>
): 
| ((input: I) => (Promise<O>)) // MustOne
| ((input: I) => (Promise<undefined | O>)) // ZeroOrOne
| ((input: I) => (Promise<O[]>)) // Many
{
    // // 내부 쿼리호출 공통 함수
    // async function localFunc<I extends {}, O extends QueryResultRow>(input: I): Promise<QueryResult<O>> {
    //     const inputKeys = Object.keys(input);
    //     let queryString = query as string;

    //     inputKeys.map((v) => {
    //         queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
    //     });

    //     const qr = await pgCurrent.query<O>(queryString);
    //     return qr;
    // }

    switch(returnCardinality) {

        case "MustOne": {
            return async function<I extends {}, O extends QueryResultRow>(input: I): Promise<O> {
        
                const inputKeys = Object.keys(input);
                let queryString = query as string;
        
                inputKeys.map((v) => {
                    queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
                });
        
                const qr = await pgCurrent.query<O>(queryString);

                if(qr.rowCount !== 1) {
                    throw new Error(`[makeQueryService: MustOne] Must Return 1 Row, But Returns${qr.rowCount} Rows`);

                } else {
                    return qr.rows[0];
                }
            }
        }

        case "ZeroOrOne": {
            return async function<I extends {}, O extends QueryResultRow>(input: I): Promise<undefined | O> {
        
                const inputKeys = Object.keys(input);
                let queryString = query as string;
        
                inputKeys.map((v) => {
                    queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
                });
        
                const qr = await pgCurrent.query<O>(queryString);

                if(qr.rowCount > 1) {
                    throw new Error(`[makeQueryService: ZeroOrOne] Must Return 0 or 1 Rows, But Returns${qr.rowCount} Rows`);

                } else if (qr.rowCount == 0) {
                    return undefined;

                } else {
                    return qr.rows[0];
                }
            }
        }

        case "Many": {
            return async function<I extends {}, O extends QueryResultRow>(input: I): Promise<O[]> {
        
                const inputKeys = Object.keys(input);
                let queryString = query as string;
        
                inputKeys.map((v) => {
                    queryString = queryString.replaceAll(`{${v}}`, (input as any)[v]);
                });
        
                const qr = await pgCurrent.query<O>(queryString);
                return qr.rows;
            }
        }
    }
}

// =========================================================================================
/*
// example
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
        'MustOne',
        `
        SELECT {id} AS "id",
                200 AS "name"
        `
    );

    const ret = await queryService({ id: '123' });
}
*/