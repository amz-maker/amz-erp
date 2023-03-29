// ===========================================================
//  월간매입내역조회
// ===========================================================
// - 작성일: 2023. 03. 28
// - 작성자: 홍사민
// ===========================================================
// [기록]
// ===========================================================
import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';

// =================================================================
//  API I/O 정의
// =================================================================
enum MontlyPrchsPayGb
{
    All   = 0,
    Day10 = 1,
    Day15 = 2,
    Day20 = 3,
    Day25 = 4,
    Etc   = 5,
}

type ApiInput = {
    payGbCd    : MontlyPrchsPayGb; // 지급구분코드
    payStartDt?: string; // 지급년월 시작
    payEndDt?  : string; // 지급년월 종료
};

type ApiOutput = {
    stdDt  : string; // [01] 기준년월
    payDay : string; // [02] 지급일
    paySum : number; // [03] 금액
};

// =================================================================
export const findMontlyPrchs = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        // console.log(`-- ${input.payGbCd} ${Number(input.payGbCd) == MontlyPrchsPayGb.Day15} ${typeof input.payGbCd} ${typeof MontlyPrchsPayGb.All} --`)

        const payDays = [] as string[];
        if(input.payGbCd == MontlyPrchsPayGb.All || input.payGbCd == MontlyPrchsPayGb.Day10) payDays.push(`'10'`);
        if(input.payGbCd == MontlyPrchsPayGb.All || input.payGbCd == MontlyPrchsPayGb.Day15) payDays.push(`'15'`);
        if(input.payGbCd == MontlyPrchsPayGb.All || input.payGbCd == MontlyPrchsPayGb.Day20) payDays.push(`'20'`);
        if(input.payGbCd == MontlyPrchsPayGb.All || input.payGbCd == MontlyPrchsPayGb.Day25) payDays.push(`'25'`);
        
        const wheres = [] as string[];
        if(input.payGbCd != MontlyPrchsPayGb.Etc) wheres.push(`PAY_DAY IN (${payDays.join(', ')})`);
        if(input.payStartDt !== undefined) wheres.push(`STD_DT >= '${input.payStartDt}'`);
        if(input.payEndDt   !== undefined) wheres.push(`STD_DT <= '${input.payEndDt}'`);
        const strWhere = wheres.length > 0 ? ` WHERE ${wheres.join('\n   AND ')}` : '';

        const qs = 
`
WITH CTE AS
(
${
    input.payGbCd != MontlyPrchsPayGb.Etc ? 
`    SELECT STD_DT, PAY_DAY, PAY_SUM AS PAY_PRC
      FROM SF001L1 -- 임직원급여내역
     UNION ALL
    SELECT STD_DT, PAY_DAY, MONTH_CTRCT_PRC AS PAY_PRC
      FROM FL001L1 -- 계약직급여내역` : ''
}${
    input.payGbCd == MontlyPrchsPayGb.All  ? 
`
     UNION ALL 
` : ''
}${
    input.payGbCd == MontlyPrchsPayGb.All || input.payGbCd == MontlyPrchsPayGb.Etc ? 
`    SELECT STD_DT, PAY_DAY, PRCHS_PRC AS PAY_PRC
      FROM PC001L1 -- 기타매입내역` : ''
}
)
SELECT
       COALESCE(STD_DT, 'TOTAL')  AS "stdDt"
      ,PAY_DAY                    AS "payDay"
      ,SUM(PAY_PRC::NUMERIC::INT) AS "paySum"
  FROM CTE
${strWhere}
 GROUP BY (PAY_DAY), ROLLUP(STD_DT)
 ORDER BY 1, 2
`
        ;

        console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);