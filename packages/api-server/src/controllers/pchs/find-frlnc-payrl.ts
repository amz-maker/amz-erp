// ===========================================================
//  계약직원급여대장조회
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
    stdDt?:   string; // 지급기준일
    frlncNm?: string; // 성명
};

// 계약직원급여내역
type ApiOutput = {
    stdDt              : string ; // [01] 기준일자 (지급 완료 일자(년월))
    seqNo              : number ; // [02] 순번 (지급 완료 일자 내 순번)
    frlncId            : string ; // [03] 계약직사번 (계약직원급여정보 FK)
    payDay             : string ; // [04] 지급일 (DD)
    frlncNm            : string ; // [05] 성명
    bsnpsnGbCd         : string ; // [06] 사업자구분코드
    billIssueGbCd      : string ; // [07] 계산서발행구분코드
    workPlace          : string ; // [08] 근무장소
    cmtmtPrjct         : string ; // [09] 투입프로젝트
    ctrctStartDt       : string ; // [10] 계약시작일
    ctrctEndDt         : string ; // [11] 계약종료일
    resgnYn            : string ; // [12] 퇴사여부
    mgmntStaffNm       : string ; // [13] 관리직원명 (관리담당자)
    workStaffNm        : string ; // [14] 근무직원명
    monthCtrctPrc      : number ; // [15] 월계약단가
    taxRat             : number ; // [16] 세금구분 (세금비율(%))
    crnntMonthWorkDay  : number ; // [17] 당월근무일수
    crnntMonthTotalDay : number ; // [18] 당월총일수
    trffcPay           : number ; // [19] 교통비
    mealPay            : number ; // [20] 식대
    etcPay             : number ; // [21] 기타비용
    etcDdctnPay        : number ; // [22] 기타차감비용
    netpyPay           : number ; // [23] 차인지급액 (실수령액)
    bankNm             : string ; // [24] 은행명
    accntNo            : string ; // [25] 계좌번호
    telNo              : string ; // [26] 연락처
    emailAddr          : string ; // [27] 이메일주소
};

// =================================================================
export const findFrlncPayrl = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT STD_DT                         AS "stdDt"              -- [01] 기준일자 (지급 완료 일자(년월))
      ,SEQ_NO                         AS "seqNo"              -- [02] 순번 (지급 완료 일자 내 순번)
      ,FRLNC_ID                       AS "frlncId"            -- [03] 계약직사번 (계약직원급여정보 FK)
      ,PAY_DAY                        AS "payDay"             -- [04] 지급일 (DD)
      ,FRLNC_NM                       AS "frlncNm"            -- [05] 성명
      ,BSNPSN_GB_CD                   AS "bsnpsnGbCd"         -- [06] 사업자구분코드
      ,BILL_ISSUE_GB_CD               AS "billIssueGbCd"      -- [07] 계산서발행구분코드
      ,WORK_PLACE                     AS "workPlace"          -- [08] 근무장소
      ,CMTMT_PRJCT                    AS "cmtmtPrjct"         -- [09] 투입프로젝트
      ,CTRCT_START_DT                 AS "ctrctStartDt"       -- [10] 계약시작일
      ,CTRCT_END_DT                   AS "ctrctEndDt"         -- [11] 계약종료일
      ,RESGN_YN                       AS "resgnYn"            -- [12] 퇴사여부
      ,MGMNT_STAFF_NM                 AS "mgmntStaffNm"       -- [13] 관리직원명 (관리담당자)
      ,WORK_STAFF_NM                  AS "workStaffNm"        -- [14] 근무직원명
      ,MONTH_CTRCT_PRC ::NUMERIC::INT AS "monthCtrctPrc"      -- [15] 월계약단가
      ,TAX_RAT                        AS "taxRat"             -- [16] 세금구분 (세금비율(%))
      ,CRNNT_MONTH_WORK_DAY           AS "crnntMonthWorkDay"  -- [17] 당월근무일수
      ,CRNNT_MONTH_TOTAL_DAY          AS "crnntMonthTotalDay" -- [18] 당월총일수
      ,TRFFC_PAY    ::NUMERIC::INT    AS "trffcPay"           -- [19] 교통비
      ,MEAL_PAY     ::NUMERIC::INT    AS "mealPay"            -- [20] 식대
      ,ETC_PAY      ::NUMERIC::INT    AS "etcPay"             -- [21] 기타비용
      ,ETC_DDCTN_PAY::NUMERIC::INT    AS "etcDdctnPay"        -- [22] 기타차감비용
      ,NETPY_PAY    ::NUMERIC::INT    AS "netpyPay"           -- [23] 차인지급액 (실수령액)
      ,BANK_NM                        AS "bankNm"             -- [24] 은행명
      ,ACCNT_NO                       AS "accntNo"            -- [25] 계좌번호
      ,TEL_NO                         AS "telNo"              -- [26] 연락처
      ,EMAIL_ADDR                     AS "emailAddr"          -- [27] 이메일주소

  FROM FL001L1
${
SqlUtil.AddWhere(input, [
    ['stdDt', '='],
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