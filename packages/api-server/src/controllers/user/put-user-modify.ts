// ===========================================================
//  테스트 - Put
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { makeQueryService } from "../../common/make-query-service";
import { wrapApiResponse } from "../../common/wrap-api-response";

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
export const putUserModify = makeFarestFrame<ApiInput, ApiOutput>(
    'Put', 
    async (input) => 
    {
        const qr = await queryService(input);

        return wrapApiResponse('Many', qr);
    }
);