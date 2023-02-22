// // ===========================================================
// //  테스트 - Get Param - 컨트롤러 내 복합 구현
// // ===========================================================
// // - 작성일: 2023. 02. 22
// // - 작성자: 홍사민
// // ===========================================================
// import { makeFarestFrame } from '../../common/make-farest';
// import { makeQueryService, makeQueryService2, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

// // =================================================================
// type ApiInput = {
//     in: number;
// };

// type ApiOutput = {
//     out1: number;
//     out2: number;
//     out3: number;
// };

// // =================================================================
// // 쿼리 : 파일 분리 가능
// // =================================================================
// type QueryInput = ApiInput;
// type QueryOutput = ApiOutput;

// const queryService1 = makeQueryService<
//     QueryInput, 
//     QueryOutput
// >(
//     'Many',
//     `
//     SELECT 
//         {in}      AS "out1",
//         {in} * 10 AS "out2",
//         {in} * 20 AS "out3"
//     `
// );

// const queryService2 = makeQueryService2<
//     QueryInput, 
//     QueryOutput
// >(
//     `
//     SELECT 
//         {in}      AS "out1",
//         {in} * 10 AS "out2",
//         {in} * 20 AS "out3"
//     `
// );

// // =================================================================
// export const getUserFind = makeFarestFrame<ApiInput, ApiOutput>(
//     'Get-param', 
//     'in', // FIXME: Get-Param API는 파라미터명 명시적 정의 필요
//     async (input) => 
// {
//     const qr1 = await queryService1(input);
//     const qr2 = await queryService2(input, 'Many');
//     const aa = 

//     return wrapQueryReturnToApiResponse('Many', qr1);

// });