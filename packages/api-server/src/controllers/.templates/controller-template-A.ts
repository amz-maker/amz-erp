// ===========================================================
//  컨트롤러 템플릿 - A (비추)
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================
// - 쿼리 서비스를 따로 작성하지 않는 템플릿
// - 출력 타입을 명시적으로 제약하지 못함
// ===========================================================
import { pgCurrent } from "../../config/db-config";
import { makeFarestController } from '../../common/make-farest';

type ApiInput = {
    in1: number;
    in2: string;
};

type ApiOutput = {
    out1: number;
    out2: number;
    out3: string;
};

type QueryOutput = ApiOutput;

// =================================================================
export const getTemplateA = makeFarestController<ApiInput, ApiOutput>(
    'Get-query', 
    async (input) => 
{
    const strQuery = 
    `
        SELECT ${input.in1} * 100 AS "first"
              ,${input.in2} * 200 AS "second"
    `;

    const qr = await pgCurrent.query<QueryOutput>(strQuery);

    return {
        results: qr.rows
    };
});