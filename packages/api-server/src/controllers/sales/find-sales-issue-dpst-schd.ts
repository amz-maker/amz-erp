// ===========================================================
//  매출발행/입금내역 조회
// ===========================================================
// - 작성일: //FIXME
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - 요건: [매출발행 입금내역관리 우상단 길쭉]
// - INPUT: 
// - OUTPUT: 
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
    ctrctStartDt?: string; // 계약기간 시작
    ctrctEndDt?: string; // 계약기간 종료
    orderCompn?: string;// 발주사
    ctrctCompn?: string;// 계약사
    prjctNm?: string;// 프로젝트명
    ctrctTypeCd?: string;// 계약유형
    payGbCd?: string; // 지급구분
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