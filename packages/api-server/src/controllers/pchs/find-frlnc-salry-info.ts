// ===========================================================
//  계약직원급여기본정보조회
// ===========================================================
// - 작성일: 2023. 03. 27
// - 작성자: 홍사민
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
    frlncNm?: string; // 성명
};

// 계약직원급여정보
type ApiOutput = {
    frlncId       : string ; // [01] 프리랜서사번
    payDay        : string ; // [02] 지급일 (DD)
    frlncNm       : string ; // [03] 성명
    bsnpsnGbCd    : string ; // [04] 사업자구분코드
    billIssueGbCd : string ; // [05] 계산서발행구분코드
    workPlace     : string ; // [06] 근무장소
    cmtmtPrjct    : string ; // [07] 투입프로젝트
    ctrctStartDt  : string ; // [08] 계약시작일
    ctrctEndDt    : string ; // [09] 계약종료일
    resgnYn       : string ; // [10] 퇴사여부
    mgmntStaffNm  : string ; // [11] 관리직원명 (관리담당자)
    workStaffNm   : string ; // [12] 근무직원명
    monthCtrctPrc : number ; // [13] 월계약단가
    taxRat        : number ; // [14] 세금구분 (세금비율(%))
    bankNm        : string ; // [15] 은행명
    accntNo       : string ; // [16] 계좌번호
    telNo         : string ; // [17] 연락처
    emailAddr     : string ; // [18] 이메일주소
};

// =================================================================
export const findFrlncSalryInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT FRLNC_ID                      AS "frlncId"       -- [01] 프리랜서사번
      ,PAY_DAY                       AS "payDay"        -- [02] 지급일 (DD)
      ,FRLNC_NM                      AS "frlncNm"       -- [03] 성명
      ,BSNPSN_GB_CD                  AS "bsnpsnGbCd"    -- [04] 사업자구분코드
      ,BILL_ISSUE_GB_CD              AS "billIssueGbCd" -- [05] 계산서발행구분코드
      ,WORK_PLACE                    AS "workPlace"     -- [06] 근무장소
      ,CMTMT_PRJCT                   AS "cmtmtPrjct"    -- [07] 투입프로젝트
      ,CTRCT_START_DT                AS "ctrctStartDt"  -- [08] 계약시작일
      ,CTRCT_END_DT                  AS "ctrctEndDt"    -- [09] 계약종료일
      ,RESGN_YN                      AS "resgnYn"       -- [10] 퇴사여부
      ,MGMNT_STAFF_NM                AS "mgmntStaffNm"  -- [11] 관리직원명 (관리담당자)
      ,WORK_STAFF_NM                 AS "workStaffNm"   -- [12] 근무직원명
      ,MONTH_CTRCT_PRC::NUMERIC::INT AS "monthCtrctPrc" -- [13] 월계약단가
      ,TAX_RAT                       AS "taxRat"        -- [14] 세금구분 (세금비율(%))
      ,BANK_NM                       AS "bankNm"        -- [15] 은행명
      ,ACCNT_NO                      AS "accntNo"       -- [16] 계좌번호
      ,TEL_NO                        AS "telNo"         -- [17] 연락처
      ,EMAIL_ADDR                    AS "emailAddr"     -- [18] 이메일주소

  FROM FL001M1
${
SqlUtil.AddWhere(input, [
    ['frlncNm', 'LIKE'],
])
}
`
        ;

        // console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);