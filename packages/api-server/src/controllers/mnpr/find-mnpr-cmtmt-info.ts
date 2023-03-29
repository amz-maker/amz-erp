// ===========================================================
//  인력투입실적기본정보조회
// ===========================================================
// - 작성일: 2023. 03. 24
// - 작성자: 홍사민
// ===========================================================
// [기록]
// ===========================================================
import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';
import SqlUtil from '../../utils/sql.util';
import { StrictQuery } from 'common/make-query-service';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    ctrctStartDt?: string; // 계약기간 시작
    ctrctEndDt?  : string; // 계약기간 종료
    orderCompn?  : string; // 발주사
    ctrctCompn?  : string; // 계약사
    prjctNm?     : string; // 프로젝트명
    ctrctTypeCd? : string; // 계약유형
    payGbCd?     : string; // 지급구분
};

type ApiOutput = {
    ctrctNo         : string; // 계약번호
    bsntypNm        : string; // 업종명
    orderCompn      : string; // 발주사
    ctrctCompn      : string; // 계약사
    prjctNm         : string; // 프로젝트명
    prjctContn      : string; // 프로젝트내용
    totalCtrctPrc   : number; // 총계약금
    ctrctTypeCd     : string; // 계약유형코드
    chngYn          : string; // 변경여부
    ctrctStartDt    : string; // 계약시작일자
    ctrctEndDt      : string; // 계약종료일자
    totalCtrctMhour : number; // 총계약공수
    totalPrchsPrc   : number; // 총매입금액
};

// =================================================================
export const findMnprCmtmtInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
WITH RECURSIVE
CTE AS (
    SELECT CTRCT_NO
          ,ISSUE_DT
          ,DPST_DT
          ,(CASE WHEN (DPST_PRC > 0::MONEY) THEN DPST_PRC ELSE ISSUE_SCHD_PRC END)::NUMERIC::BIGINT AS L1_PRICE
      FROM SL001L1
     WHERE ISSUE_DT IS NOT NULL
),
CTE_MNM AS (
    SELECT CTRCT_NO
          ,(
               SELECT SUM(s)
                 FROM UNNEST(MNM_ARR) s
           ) AS SUM_MNM
      FROM MP001M1
),
CTE_MNM_GRP AS (
    SELECT
           CTRCT_NO
          ,SUM(SUM_MNM) AS TOTAL_MNM
      FROM CTE_MNM
     GROUP BY CTRCT_NO
)
SELECT DISTINCT ON (M.CTRCT_NO)
       M.CTRCT_NO                         AS "ctrctNo"       -- 계약번호
      ,M.BSNTYP_NM                        AS "bsntypNm"      -- 업종명
      ,M.ORDER_COMPN                      AS "orderCompn"    -- 발주사
      ,M.CTRCT_COMPN                      AS "ctrctCompn"    -- 계약사
      ,M.PRJCT_NM                         AS "prjctNm"       -- 프로젝트명
      ,M.PRJCT_CONTN                      AS "prjctContn"    -- 프로젝트내용
      ,M.TOTAL_CTRCT_PRC::NUMERIC::BIGINT AS "totalCtrctPrc" -- 총계약금
      ,M.CTRCT_TYPE_CD                    AS "ctrctTypeCd"   -- 계약유형코드
      ,M.CHNG_YN                          AS "chngYn"        -- 변경여부
      ,M.CTRCT_START_DT                   AS "ctrctStartDt"  -- 계약시작일자
      ,M.CTRCT_END_DT                     AS "ctrctEndDt"    -- 계약종료일자
      ,SUM(L1_PRICE) OVER W               AS "totalPrchsPrc" -- 총매입금액
      ,TOTAL_MNM                          AS "totalMnm"      -- 총계약공수

  FROM SL001M1 M
            INNER JOIN CTE L       USING (CTRCT_NO)
       LEFT OUTER JOIN CTE_MNM_GRP USING (CTRCT_NO)
${
SqlUtil.AddWhere(input, [
    ['ctrctStartDt', '>='],
    ['ctrctEndDt'  , '<='],
    ['ctrctCompn'  , 'LIKE'],
    ['orderCompn'  , 'LIKE'],
    ['prjctNm'     , 'LIKE'],
    ['ctrctTypeCd' , '='],
    ['payGbCd'     , '='],
])
}
WINDOW W AS (PARTITION BY CTRCT_NO)
ORDER BY CTRCT_NO ASC
`
        ;

        console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);