// ===========================================================
//  공통 타입 정의
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
export type QueryResultFrame<O> = O | O[] | null;
export type QueryResultOption = 'One' | 'Many';

export type ErrorString = string;
export type RestMethod = 'Get-param' | 'Get-query' | 'Post' | 'Put';

// API 응답 형태
export type ApiResponse<O> = {
    // null: 단건 - 결과 없음
    // O   : 단건 - 결과 있음
    result: null | O;
    error?: ErrorString
} | {
    // O[] : 다건
    results: O[];
    error?: ErrorString
}
;