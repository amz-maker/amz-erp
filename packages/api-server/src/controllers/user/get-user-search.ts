// ===========================================================
//  테스트 - Get Query
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { makeQueryService, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

// =================================================================
type ApiInput = {
    in1: number;
    in2: number;
};

type ApiOutput = {
    out1: number;
    out2: number;
    out3: number;
};

// =================================================================
// 쿼리 : 파일 분리 가능
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
        {in1}      AS "out1",
        {in1} * 10 AS "out2",
        {in2} * 20 AS "out3"
    `
);

// =================================================================
export const getUserSearch = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    null,
    async (input) => 
{
    const qr = await queryService(input);

    return wrapQueryReturnToApiResponse('Many', qr);

});