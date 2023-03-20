// ===========================================================
//  매출발행/입금내역 월별 조회 // TODO
// ===========================================================
// - 작성일: 2023. 03. 20.
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - 요건: 매출발행 입금내역관리 - 우상단
// ===========================================================
// [기록]
// ===========================================================

// TODO: CTRCT_NO 단위로 길쭉하게 가로로 뽑을 예정
/*
{
    results: 
    // CTRCT_NO 단위 하나에 배열 엘리먼트 하나
    {
        계약번호,
        업종,
        ...,
        총금액,
        arr: {
                발행년월,
                발행일,
                금액,
                입금일,
                진행상태,
            }[]
    }[]
}
*/
// TODO: 총금액 집계 => 이렇게 할 필요 없을듯...? 어쨌든 집계 합 필요(요건참조)
/*
WITH CTE AS (
SELECT
    CTRCT_NO           AS CTRCT_NO
    ,LEFT(ISSUE_DT, 6) AS ISSUE_YM
    ,ISSUE_DT          AS ISSUE_DT
    ,(CASE WHEN (DPST_PRC > 0::MONEY) THEN DPST_PRC ELSE ISSUE_SCHD_PRC END)::NUMERIC::INT AS ISSUE_DPST_PRC -- ISSUE_SCHD_PRC: 발행액/ DPST_PRC: 입금액
    ,DPST_DT           AS DPST_DT
    ,STAT_GB_CD        AS STAT_GB_CD
FROM SL001L1
WHERE ISSUE_DT IS NOT NULL
  AND CTRCT_NO = '2022001'
)
SELECT
    CTRCT_NO AS "계약번호"
    ,ISSUE_YM AS "발행년월"
    ,ISSUE_DT AS "발행일"
--     ,ISSUE_DPST_PRC AS "발행/입금 금액" -- ISSUE_SCHD_PRC: 발행액/ DPST_PRC: 입금액
    ,DPST_DT AS "입금일"
    ,STAT_GB_CD AS "진행상태"
    ,SUM(ISSUE_DPST_PRC) AS "발행/입금 금액"
    ,(CASE WHEN GROUPING(CTRCT_NO) = 1 THEN 'Total' ELSE 'content' END) AS "Category"
FROM CTE
    GROUP BY ROLLUP(STAT_GB_CD, DPST_DT, ISSUE_DT, ISSUE_YM, CTRCT_NO)
    HAVING (CTRCT_NO IS NOT NULL) OR (STAT_GB_CD IS NULL)
;
*/






import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';
import SqlUtil from '../../utils/sql.util';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    ctrctStartDt?: string; // 계약기간 시작(YYYYMMDD)
    ctrctEndDt?  : string; // 계약기간 종료(YYYYMMDD)
    orderCompn?  : string; // 발주사
    ctrctCompn?  : string; // 계약사
    prjctNm?     : string; // 프로젝트명
    ctrctTypeCd? : string; // 계약유형
    payGbCd?     : string; // 지급구분

    issueStartDt?: string; // 발행일기준 시작(YYYYMMDD)
    issueEndDt?  : string; // 발행일기준 종료(YYYYMMDD)
    dpstStartDt? : string; // 입금일기준 시작(YYYYMMDD)
    dpstEndDt?   : string; // 입금일기준 종료(YYYYMMDD)
};

type ApiOutput = {
    ctrctNo       : string; // 계약번호
    bsntypNm      : string; // 업종명
    orderCompn    : string; // 발주사
    ctrctCompn    : string; // 계약사
    prjctNm       : string; // 프로젝트명
    prjctContn    : string; // 프로젝트내용
    totalCtrctPrc : number; // 총계약금
    ctrctTypeCd   : string; // 계약유형코드
    chngYn        : string; // 변경여부
    payGbCd       : string; // 지급구분코드
    issueSchdGbCd : string; // 발행일구분코드
    issueSchdDay  : string; // 발행예정일
    rvrsIssueYn   : string; // 역발행여부
    dpstSchdDay   : string; // 입금예정일
    ctrctStartDt  : string; // 계약시작일자
    ctrctEndDt    : string; // 계약종료일자
};

// =================================================================
export const findSalesIssueDpstSchd = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const queryString = 
        `
SELECT CTRCT_NO         AS "ctrctNo"       -- 계약번호
      ,BSNTYP_NM        AS "bsntypNm"      -- 업종명
      ,ORDER_COMPN      AS "orderCompn"    -- 발주사
      ,CTRCT_COMPN      AS "ctrctCompn"    -- 계약사
      ,PRJCT_NM         AS "prjctNm"       -- 프로젝트명
      ,PRJCT_CONTN      AS "prjctContn"    -- 프로젝트내용
      ,TOTAL_CTRCT_PRC  AS "totalCtrctPrc" -- 총계약금
      ,CTRCT_TYPE_CD    AS "ctrctTypeCd"   -- 계약유형코드
      ,CHNG_YN          AS "chngYn"        -- 변경여부
      ,PAY_GB_CD        AS "payGbCd"       -- 지급구분코드
      ,ISSUE_SCHD_GB_CD AS "issueSchdGbCd" -- 발행일구분코드
      ,ISSUE_SCHD_DAY   AS "issueSchdDay"  -- 발행예정일
      ,RVRS_ISSUE_YN    AS "rvrsIssueYn"   -- 역발행여부
      ,DPST_SCHD_DAY    AS "dpstSchdDay"   -- 입금예정일
      ,CTRCT_START_DT   AS "ctrctStartDt"  -- 계약시작일자
      ,CTRCT_END_DT     AS "ctrctEndDt"    -- 계약종료일자

  FROM SL001M1
        `
        + 
        SqlUtil.AddWhere(input, [
            ['ctrctStartDt', '>'],
            ['ctrctEndDt'  , '<'],
            ['ctrctCompn'  , 'LIKE'],
            ['orderCompn'  , 'LIKE'],
            ['prjctNm'     , 'LIKE'],
            ['payGbCd'     , '='],
            ['ctrctTypeCd' , '='],
        ]);

        // console.log(queryString);

        const qr = (await pgCurrent.query<ApiOutput>(queryString)).rows;

        return wrapApiResponse('Many', qr);

    }, 
);