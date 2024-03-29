// ===========================================================
//  날짜/시간 관련 타입 정의
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
/**
 * 유효기간
 */
export type Duration = {
    day?: number;
    hour?: number;
    min?: number;
    sec?: number;
};

export type UnixTime = number;