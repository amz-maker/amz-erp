// ===========================================================
//  공통 타입 정의
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
export type QueryResultFrame<O> = O | O[] | undefined;
export type ReturnCardinality = 'ZeroOrOne' | 'MustOne' | 'Many'; // 리턴 Row 개수

export type ErrorString = string;
export type RestMethod = 'Get-param' | 'Get-query' | 'Post' | 'Put' | 'Patch' | 'Delete';

// API 응답 형태
export type ApiResponse<O> = {
    // undefined: 단건 - 결과 없음
    // O        : 단건 - 결과 있음
    result: undefined | O;
    error?: ErrorString;
} | {
    // O[] : 다건
    resultCount?: number;
    results: O[];
    error?: ErrorString;
}
;

export type UriString = `/${string}`;