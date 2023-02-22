// ===========================================================
//  템플릿 - 컨트롤러 내 복합 구현 // FIXME
// ===========================================================
// - 작성일: 2023. // FIXME
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { makeQueryService, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

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
//  쿼리, I/O 정의 (or 서비스 파일 분리)
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
    null,
    async (input) => 
{
    const qr = await queryService(input);
    

    return wrapQueryReturnToApiResponse('Many', qr);

});