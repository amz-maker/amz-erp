// ===========================================================
//  매출발행/입금내역 월별 조회
// ===========================================================
// - 작성일: 2023. 03. 21.
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - 요건: 매출발행 입금내역관리 - 우상단
// ===========================================================
// [기록]
// ===========================================================

/*
{
    results: 
    // CTRCT_NO 단위 하나에 배열 엘리먼트 하나
    {
        계약번호,
        업종,
        ...,
        총금액,
        list: {
                발행년월,
                발행일,
                금액,
                입금일,
                진행상태,
            }[]
    }[]
}
*/
import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';
import SqlUtil from '../../utils/sql.util';

// =================================================================
//  I/O 정의
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

type QueryOutput1 = {
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
    totalPrc      : number; // 총금액
};

type QueryOutput2 = {
    ctrctNo      : string; // 계약번호
    issueYm      : string; // 발행년월
    issueDt      : string; // 발행일자
    issueDpstPrc : string; // 발행/입금액
    dpstDt       : string; // 입금일자
    statGbCd     : string; // 진행상태구분코드
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
    totalPrc      : number; // 총금액
    list: Exclude<QueryOutput2, 'ctrctNo'>[]
};

// =================================================================
export const findSalesIssueDpstMontly = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs1 = 
`
WITH CTE AS (
    SELECT CTRCT_NO
          ,ISSUE_DT
          ,DPST_DT
          ,(CASE WHEN (DPST_PRC > 0::MONEY) THEN DPST_PRC ELSE ISSUE_SCHD_PRC END)::NUMERIC::INT AS L1_PRICE
      FROM SL001L1
     WHERE ISSUE_DT IS NOT NULL
)
SELECT DISTINCT ON (M.CTRCT_NO)
       M.CTRCT_NO         AS "ctrctNo"       -- 계약번호
      ,M.BSNTYP_NM        AS "bsntypNm"      -- 업종명
      ,M.ORDER_COMPN      AS "orderCompn"    -- 발주사
      ,M.CTRCT_COMPN      AS "ctrctCompn"    -- 계약사
      ,M.PRJCT_NM         AS "prjctNm"       -- 프로젝트명
      ,M.PRJCT_CONTN      AS "prjctContn"    -- 프로젝트내용
      ,M.TOTAL_CTRCT_PRC  AS "totalCtrctPrc" -- 총계약금
      ,M.CTRCT_TYPE_CD    AS "ctrctTypeCd"   -- 계약유형코드
      ,M.CHNG_YN          AS "chngYn"        -- 변경여부
      ,M.PAY_GB_CD        AS "payGbCd"       -- 지급구분코드
      ,M.ISSUE_SCHD_GB_CD AS "issueSchdGbCd" -- 발행일구분코드
      ,M.ISSUE_SCHD_DAY   AS "issueSchdDay"  -- 발행예정일
      ,M.RVRS_ISSUE_YN    AS "rvrsIssueYn"   -- 역발행여부
      ,M.DPST_SCHD_DAY    AS "dpstSchdDay"   -- 입금예정일
      ,M.CTRCT_START_DT   AS "ctrctStartDt"  -- 계약시작일자
      ,M.CTRCT_END_DT     AS "ctrctEndDt"    -- 계약종료일자
      ,SUM(L1_PRICE) OVER W AS "totalPrice"

  FROM SL001M1 M INNER JOIN CTE L USING(CTRCT_NO)
${
SqlUtil.AddWhere(input, [
    ['ctrctStartDt', '>='],
    ['ctrctEndDt'  , '<='],
    ['ctrctCompn'  , 'LIKE'],
    ['orderCompn'  , 'LIKE'],
    ['prjctNm'     , 'LIKE'],
    ['payGbCd'     , '='],
    ['ctrctTypeCd' , '='],

    ['issueStartDt' , '>=', 'Quot', 'issueDt'],
    ['issueEndDt'   , '<=', 'Quot', 'issueDt'],
    ['dpstStartDt'  , '>=', 'Quot', 'dpstDt'],
    ['dpstEndDt'    , '<=', 'Quot', 'dpstDt'],
])
}
WINDOW W AS (PARTITION BY CTRCT_NO)
ORDER BY CTRCT_NO ASC
`
        ;
        const qr1 = (await pgCurrent.query<QueryOutput1>(qs1)).rows;
        const ctrctNoList = qr1.map((v: QueryOutput1) => ( `'${v.ctrctNo}'` )).join(', ')

        const qs2 = 
`
SELECT
       CTRCT_NO          AS "ctrctNo"
      ,LEFT(ISSUE_DT, 6) AS "issueYm"
      ,ISSUE_DT          AS "issueDt"
      ,(CASE WHEN (DPST_PRC > 0::MONEY) THEN DPST_PRC ELSE ISSUE_SCHD_PRC END)::NUMERIC::INT
                         AS "issueDpstPrc" -- 발행/입금액
      ,DPST_DT           AS "dpstDt"
      ,STAT_GB_CD        AS "statGbCd"
 FROM SL001L1
${
    SqlUtil.AddWhere(input, [
        ['issueStartDt' , '>=', 'Quot', 'issueDt'],
        ['issueEndDt'   , '<=', 'Quot', 'issueDt'],
        ['dpstStartDt'  , '>=', 'Quot', 'dpstDt'],
        ['dpstEndDt'    , '<=', 'Quot', 'dpstDt'],
    ])
}
AND ISSUE_DT IS NOT NULL
AND CTRCT_NO IN (${ctrctNoList})
ORDER BY 1, 2 ASC
`
        ;
        const qr2 = (await pgCurrent.query<QueryOutput2>(qs2)).rows as QueryOutput2[];

        // 가공
        const map3 = {} as any;
        for(const e of qr2) {
            const ctrctNo = e['ctrctNo'];
            if(map3[ctrctNo] === undefined) {
                map3[ctrctNo] = [] as QueryOutput2[]
            }
            
            map3[ctrctNo].push({
                issueYm: e.issueYm,
                issueDt: e.issueDt,
                issueDpstPrc: e.issueDpstPrc,
                dpstDt: e.dpstDt,
                statGbCd: e.statGbCd,
                // ...e,
                // ctrctNo: undefined,
            });
        }

        for(let i = 0; i < qr1.length; i++) {
            const elm = qr1[i];
            const ctrctNo = elm.ctrctNo;
            (elm as any)['list'] = map3[ctrctNo];
        }

        // console.log(JSON.stringify(qr1));
        const res = qr1 as ApiOutput[];

        return wrapApiResponse('Many', res);

    }, 
);