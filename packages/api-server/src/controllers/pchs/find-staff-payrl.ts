// ===========================================================
//  임직원급여대장조회
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
    staffNm?: string; // 성명
};

// 임직원급여내역
type ApiOutput = {
    stdDt          : string ; // [01] 기준일자 (지급 완료 일자(년월))
    seqNo          : number ; // [02] 순번 (지급 완료 일자 내 순번)
    payDay         : string ; // [03] 지급일 (임직원급여정보 데이터)
    staffNm        : string ; // [04] 성명
    staffId        : string ; // [05] 사번 (임직원급여정보 FK)
    ofcrspNm       : string ; // [06] 직책명
    workPlace      : string ; // [07] 근무장소
    birthDt        : string ; // [08] 생년월일
    entrnDt        : string ; // [09] 입사일자
    resgnDt        : string ; // [10] 퇴사일자
    resgnYn        : string ; // [11] 퇴사여부
    postnCd        : string ; // [12] 직위코드
    basePay        : number ; // [13] 기본급
    ofcrspPay      : number ; // [14] 직책수당
    mealPay        : number ; // [15] 식대
    insrnPay       : number ; // [16] 보험료
    rsrchPay       : number ; // [17] 연구비
    drivePay       : number ; // [18] 자가운전보조비
    chldcPay       : number ; // [19] 보육비
    cmnctnPay      : number ; // [20] 통신비
    extraPay       : number ; // [21] 기타금액
    irpPay         : number ; // [22] IRP 지원금
    inctvPay       : number ; // [23] 인센티브
    paySum         : number ; // [24] 지급합계
    natnlPensnTax  : number ; // [25] 국민연금
    helthInsrnTax  : number ; // [26] 건강보험료
    emplmtInsrnTax : number ; // [27] 고용보험료
    careInsrnTax   : number ; // [28] 요양보험료
    incmTax        : number ; // [29] 소득세
    localIncmTax   : number ; // [30] 지방소득세
    etcDdctnPrc    : number ; // [31] 기타차감액
    ddctnSumPrc    : number ; // [32] 공제합계액
    netpyPay       : number ; // [33] 차인지급액 (실수령액)
    chrgPrc        : number ; // [34] 수수료
    bankNm         : string ; // [35] 은행명
    accntNo        : string ; // [36] 계좌번호
    telNo          : string ; // [37] 연락처
    emailAddr      : string ; // [38] 이메일주소
};

// =================================================================
export const findStaffPayrl = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT STD_DT           AS "stdDt"          -- [01] 기준일자 (지급 완료 일자(년월))
      ,SEQ_NO           AS "seqNo"          -- [02] 순번 (지급 완료 일자 내 순번)
      ,PAY_DAY          AS "payDay"         -- [03] 지급일 (임직원급여정보 데이터)
      ,STAFF_NM         AS "staffNm"        -- [04] 성명
      ,STAFF_ID         AS "staffId"        -- [05] 사번 (임직원급여정보 FK)
      ,OFCRSP_NM        AS "ofcrspNm"       -- [06] 직책명
      ,WORK_PLACE       AS "workPlace"      -- [07] 근무장소
      ,BIRTH_DT         AS "birthDt"        -- [08] 생년월일
      ,ENTRN_DT         AS "entrnDt"        -- [09] 입사일자
      ,RESGN_DT         AS "resgnDt"        -- [10] 퇴사일자
      ,RESGN_YN         AS "resgnYn"        -- [11] 퇴사여부
      ,POSTN_CD         AS "postnCd"        -- [12] 직위코드
      ,BASE_PAY         AS "basePay"        -- [13] 기본급
      ,OFCRSP_PAY       AS "ofcrspPay"      -- [14] 직책수당
      ,MEAL_PAY         AS "mealPay"        -- [15] 식대
      ,INSRN_PAY        AS "insrnPay"       -- [16] 보험료
      ,RSRCH_PAY        AS "rsrchPay"       -- [17] 연구비
      ,DRIVE_PAY        AS "drivePay"       -- [18] 자가운전보조비
      ,CHLDC_PAY        AS "chldcPay"       -- [19] 보육비
      ,CMNCTN_PAY       AS "cmnctnPay"      -- [20] 통신비
      ,EXTRA_PAY        AS "extraPay"       -- [21] 기타금액
      ,IRP_PAY          AS "irpPay"         -- [22] IRP 지원금
      ,INCTV_PAY        AS "inctvPay"       -- [23] 인센티브
      ,PAY_SUM          AS "paySum"         -- [24] 지급합계
      ,NATNL_PENSN_TAX  AS "natnlPensnTax"  -- [25] 국민연금
      ,HELTH_INSRN_TAX  AS "helthInsrnTax"  -- [26] 건강보험료
      ,EMPLMT_INSRN_TAX AS "emplmtInsrnTax" -- [27] 고용보험료
      ,CARE_INSRN_TAX   AS "careInsrnTax"   -- [28] 요양보험료
      ,INCM_TAX         AS "incmTax"        -- [29] 소득세
      ,LOCAL_INCM_TAX   AS "localIncmTax"   -- [30] 지방소득세
      ,ETC_DDCTN_PRC    AS "etcDdctnPrc"    -- [31] 기타차감액
      ,DDCTN_SUM_PRC    AS "ddctnSumPrc"    -- [32] 공제합계액
      ,NETPY_PAY        AS "netpyPay"       -- [33] 차인지급액 (실수령액)
      ,CHRG_PRC         AS "chrgPrc"        -- [34] 수수료
      ,BANK_NM          AS "bankNm"         -- [35] 은행명
      ,ACCNT_NO         AS "accntNo"        -- [36] 계좌번호
      ,TEL_NO           AS "telNo"          -- [37] 연락처
      ,EMAIL_ADDR       AS "emailAddr"      -- [38] 이메일주소

  FROM SF001L1
${
SqlUtil.AddWhere(input, [
    ['stdDt', '='],
    ['staffNm', 'LIKE'],
])
}
`
        ;

        // console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);