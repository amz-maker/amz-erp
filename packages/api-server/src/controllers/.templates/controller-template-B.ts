// ===========================================================
//  컨트롤러 템플릿 - B
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
// - 쿼리 서비스를 따로 작성하는 템플릿
// ===========================================================
import { makeFarestController } from '../../common/make-farest';
import { makeQueryService, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

// =================================================================
type ApiInput = {
    in1: number;
    in2: string;
};

type ApiOutput = {
    out1: number;
    out2: number;
    out3: string;
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
        {in1} * 20 AS "out2",
        {in2}      AS "out3"
    `
);

// =================================================================
export const getTemplateB = makeFarestController<ApiInput, ApiOutput>(
    'Get-query', 
    async (input) => 
{
    const qr = await queryService(input);

    return wrapQueryReturnToApiResponse('Many', qr);
});