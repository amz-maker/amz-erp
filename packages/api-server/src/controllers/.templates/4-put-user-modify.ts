// ===========================================================
//  템플릿 - Put // FIXME
// ===========================================================
// - 작성일: 2023. // FIXME
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { makeQueryService } from "../../common/make-query-service";
import { wrapApiResponse } from "../../common/wrap-api-response";

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    in: number;
};

type ApiOutput = {
    out1: number;
    out2: number;
    out3: number;
};

// =================================================================
//  쿼리, I/O 정의 (or 서비스 파일 별도 분리)
// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;

const queryService = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'Many',
    `
    SELECT 
        {in}      AS "out1",
        {in} * 10 AS "out2",
        {in} * 20 AS "out3"
    `
);

// =================================================================
// FIXME: 이름 정의
export const TEMPLATE_PUT = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-param',
    async (input) => 
    {
        const qr = await queryService(input);

        return wrapApiResponse('Many', qr);

    },
    'in' // FIXME: Get-Param API는 파라미터명 명시적 정의 필요
);