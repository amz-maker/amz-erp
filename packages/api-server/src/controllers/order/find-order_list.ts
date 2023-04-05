// ===========================================================
//  발주내역 조회 
// ===========================================================
// - 작성일: 2023. 04. 04
// - 작성자: 박진실
// ===========================================================
// [기록]
// ===========================================================
import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';
import SqlUtil from '../../utils/sql.util';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    prjNm      : string ; // 프로젝트명
    ctrctGb    : string ; // 계약구분
};


// 발주정보 
type ApiOutput = {

    seqNo            : number ; // [01] 순번 (발주정보 FK)
    bsntyp           : string ; // [02] 업종
    orderCompn       : string ; // [03] 발주사
    biddn            : string ; // [04] 입찰
    ctrctCompn       : string ; // [05] 계약회사
    prjNm            : string ; // [06] 프로젝트명
    busnssContn      : string ; // [07] 사업내용
    devEnv           : string ; // [08] 개발환경
    orderSchdDt      : string ; // [09] 발주예정일자
    prgsStatInfo     : string ; // [10] 진행상태정보
    startSchdDt      : string ; // [11] 시작예정일자 (착수예정일자)
    expctPrjPerd     : string ; // [12] 예상프로젝트기간
    expctCmtmtNumppl : number ; // [13] 예상투입인원수
    expctMemmn       : number ; // [14] 예상투입공수(decimal)
    mainCmtmtMem     : string ; // [15] 주요투입인력
    expctSalesPrc    : number ; // [16] 예상매출금액
    subcnForm        : string ; // [17] 하도급형태
    mangr            : string ; // [18] 담당자
    mangrTel         : string ; // [19] 담당자연락처
    salesReprs       : string ; // [20] 영업대표
    ctrctGb          : string ; // [21] 계약구분
    actcmtMem        : string ; // [22] 실투입인력
    ctrctPrc         : number ; // [23] 계약금액
    ctrctStartDt     : string ; // [24] 계약시작일자
    ctrctEndDt       : string ; // [25] 계약종료일자
    ctrctPerd        : string ; // [26] 계약기간
    ctrctForm        : string ; // [27] 계약형태
    ctrctAttch       : string ; // [28] 계약서첨부
    finalCorrcDt     : string ; // [29] 최종수정일자
    finalModfr       : string ; // [30] 최종수정자
    finalRegst       : string ; // [31] 최종등록자
    kind             : string ; // [32] 종류

   
};

// =================================================================
export const findOrderList = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT SEQ_NO             AS seqNo            -- [01] 순번 (발주정보 FK)
      ,BSNTYP             AS bsntyp           -- [02] 업종
      ,ORDER_COMPN        AS orderCompn       -- [03] 발주사
      ,BIDDN              AS biddn            -- [04] 입찰
      ,CTRCT_COMPN        AS ctrctCompn       -- [05] 계약회사
      ,PRJ_NM             AS prjNm            -- [06] 프로젝트명
      ,BUSNSS_CONTN       AS busnssContn      -- [07] 사업내용
      ,DEV_ENV            AS devEnv           -- [08] 개발환경
      ,ORDER_SCHD_DT      AS orderSchdDt      -- [09] 발주예정일자
      ,PRGS_STAT_INFO     AS prgsStatInfo     -- [10] 진행상태정보
      ,START_SCHD_DT      AS startSchdDt      -- [11] 시작예정일자 (착수예정일자)
      ,EXPCT_PRJ_PERD     AS expctPrjPerd     -- [12] 예상프로젝트기간
      ,EXPCT_CMTMT_NUMPPL AS expctCmtmtNumppl -- [13] 예상투입인원수
      ,EXPCT_MEMMN        AS expctMemmn       -- [14] 예상투입공수
      ,MAIN_CMTMT_MEM     AS mainCmtmtMem     -- [15] 주요투입인력
      ,EXPCT_SALES_PRC    AS expctSalesPrc    -- [16] 예상매출금액
      ,SUBCN_FORM         AS subcnForm        -- [17] 하도급형태
      ,MANGR              AS mangr            -- [18] 담당자
      ,MANGR_TEL          AS mangrTel         -- [19] 담당자연락처
      ,SALES_REPRS        AS salesReprs       -- [20] 영업대표
      ,CTRCT_GB           AS ctrctGb          -- [21] 계약구분
      ,ACTCMT_MEM         AS actcmtMem        -- [22] 실투입인력
      ,CTRCT_PRC          AS ctrctPrc         -- [23] 계약금액
      ,CTRCT_START_DT     AS ctrctStartDt     -- [24] 계약시작일자
      ,CTRCT_END_DT       AS ctrctEndDt       -- [25] 계약+종료일자
      ,CTRCT_PERD         AS ctrctPerd        -- [26] 계약기간
      ,CTRCT_FORM         AS ctrctForm        -- [27] 계약형태
      ,CTRCT_ATTCH        AS ctrctAttch       -- [28] 계약서첨부
      ,FINAL_CORRC_DT     AS finalCorrcDt     -- [29] 최종수정일자
      ,FINAL_MODFR        AS finalModfr       -- [30] 최종수정자
      ,FINAL_REGST        AS finalRegst       -- [31] 최종등록자
      ,KIND               AS kind             -- [32] 종류

  FROM OC001M1 
${
SqlUtil.AddWhere(input, [
    ['prjNm', 'LIKE'],
    ['ctrctGb', 'LIKE'],
])
}
`
        ;

        console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
    );