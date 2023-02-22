// ===========================================================
//  테스트 - Put
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { makeQueryService, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

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
        {in}      AS "out1",
        {in} * 10 AS "out2",
        {in} * 20 AS "out3"
    `
);

// =================================================================
export const putUserModify = makeFarestFrame<ApiInput, ApiOutput>(
    'Put', 
    null,
    async (input) => 
{
    const qr = await queryService(input);

    return wrapQueryReturnToApiResponse('Many', qr);

});