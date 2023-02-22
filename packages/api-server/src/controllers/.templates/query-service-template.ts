// ===========================================================
//  템플릿 - 쿼리 I/O, 서비스 함수 분리 // FIXME
// ===========================================================
// - 작성일: 2023. // FIXME
// - 작성자: 홍사민
// ===========================================================
// [Note]
// - 단건일 경우 쿼리 서비스 함수 정의 시 'One' 사용
// - 다건일 경우 'Many'
// ===========================================================
import { makeQueryService } from "../../common/make-query-service";

type QueryInput = {
    in1: number;
    in2: string;
};

type QueryOutput = {
    out1: number;
    out2: number;
    out3: string;
};

const queryServiceName = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'One', // 단건 or 다건 
    `
    SELECT 
        {in1}      AS "out1",
        {in1} * 20 AS "out2",
        {in2}      AS "out3"
    `
);