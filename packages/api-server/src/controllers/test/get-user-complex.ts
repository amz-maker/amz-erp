// ===========================================================
//  테스트 - Get Param - 컨트롤러 내 복합 구현
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

// Many: n개 행 리턴하는 쿼리
const queryService1 = makeQueryService<
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

// MustOne: 반드시 1개 행만 리턴하는 쿼리
const queryService2 = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'MustOne',
    `
    SELECT 
        {in}      AS "out1",
        {in} * 10 AS "out2",
        {in} * 20 AS "out3"
    `
);

// ZeroOrOne: 0개 pr 1개 행을 리턴하는 쿼리
const queryService3 = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'ZeroOrOne',
    `
    SELECT 
        {in}      AS "out1",
        {in} * 10 AS "out2",
        {in} * 20 AS "out3"
    `
);

// =================================================================
export const getUserComplex = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-param', 
    async (input) => 
    {
        const qrMany = await queryService1(input);
        const qrMustOne = await queryService2(input);
        const qrZeroOrOne = await queryService3(input);

        console.log(qrMany);
        console.log(qrMustOne);
        console.log(qrZeroOrOne);

        return wrapApiResponse('Many', qrMany);
        // return wrapApiResponse('Many', qrMustOne);   // Error
        // return wrapApiResponse('Many', qrZeroOrOne); // Error

        // return wrapApiResponse('MustOne', qrMany);   // Error
        // return wrapApiResponse('MustOne', qrMustOne);
        // return wrapApiResponse('MustOne', qrZeroOrOne); // Error
        
        // return wrapApiResponse('ZeroOrOne', qrMany); // Error
        // return wrapApiResponse('ZeroOrOne', qrMustOne);
        // return wrapApiResponse('ZeroOrOne', qrZeroOrOne);
    },
    'in'
);