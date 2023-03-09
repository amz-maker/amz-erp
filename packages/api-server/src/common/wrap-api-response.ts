// ===========================================================
//  API 응답 래퍼 함수 구현
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { ApiResponse, ReturnCardinality } from "../common-types/common";

// Overrides
/**
 * 데이터를 API 응답 오브젝트 형태로 래핑
 * @param dataCardinality ***MustOne***: 반드시 1개 행만 리턴 / ***ZeroOrOne***: 1개 또는 0개 행 리턴 / ***Many***: 0~N개 행 리턴(배열)
 * @param data 원본 데이터. {@link dataCardinality}에 따라서 사용 가능한 형태가 달라진다.
 * @returns-{@link ApiResponse<T>}
 */
export function wrapApiResponse<T>(dataCardinality: 'ZeroOrOne', data: T | undefined): ApiResponse<T>;
export function wrapApiResponse<T>(dataCardinality: 'MustOne', data: T): ApiResponse<T>;
export function wrapApiResponse<T>(dataCardinality: 'Many', data: T[]): ApiResponse<T>;

// Implement
// 오브젝트 | 배열 | undefined => ApiResponse<O> 변환
// Note: 카디널리티에 맞게 예외 처리
export function wrapApiResponse<T>(dataCardinality: ReturnCardinality, data: T | undefined | T[]): ApiResponse<T> {
    
    switch(dataCardinality) {
        case 'ZeroOrOne': {
            
            // 0
            if(data === undefined) {
                return {
                    result: undefined,
                };
            }
            // 1
            else if (!Array.isArray(data)) {
                return {
                    result: data,
                }
            } 
            // Array
            else {
                return {
                    result: undefined,
                    error: `Must Return 0 or 1 Rows, But Returns Array`
                };
            }
        }
        case 'MustOne': {

            // 0
            if(data === undefined) {
                return {
                    result: undefined,
                    error: `Must Return Only 1 Row, But Returns No Data`
                };
            }
            // 1
            else if (!Array.isArray(data)) {
                return {
                    result: data,
                }
            } 
            // Array
            else {
                return {
                    result: undefined,
                    error: `Must Return Only 1 Row, But Returns Array`
                };
            }
        }
        case 'Many': {

            // 0
            if(data === undefined) {
                return {
                    results: [],
                };
            }
            // 1
            else if (!Array.isArray(data)) {
                return {
                    results: [data],
                }
            } 
            // Array
            else {
                return {
                    results: data,
                };
            }
        }
    }

}

export function wrapErrorResponse(msg: string): ApiResponse<any> {
    return {
        result: undefined,
        error: msg,
    }
}