import { ApiResponse, ReturnCardinality } from "./common-types";

// Overrides
export function wrapApiResponse<T>(returnCardinality: 'ZeroOrOne', data: T | undefined): ApiResponse<T>;
export function wrapApiResponse<T>(returnCardinality: 'MustOne', data: T): ApiResponse<T>;
export function wrapApiResponse<T>(returnCardinality: 'Many', data: T[]): ApiResponse<T>;

// Implement
// 데이터를 API 응답 오브젝트 형태로 래핑
// 오브젝트 | 배열 | undefined => ApiResponse<O> 변환
// Note: 카디널리티에 맞게 예외 처리
export function wrapApiResponse<T>(returnCardinality: ReturnCardinality, data: T | undefined | T[]): ApiResponse<T> {
    
    switch(returnCardinality) {
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