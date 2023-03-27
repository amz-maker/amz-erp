// ===========================================================
//  임직원급여기본정보조회
// ===========================================================
// - 작성일: 2023. 03. 27 // TODO
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
    staffNm?: string; // 성명
};

// 임직원급여정보
type ApiOutput = {
    staffId   : string ; // [01] 사번
    payDay    : string ; // [02] 지급일 (DD)
    staffNm   : string ; // [03] 성명
    birthDt   : string ; // [04] 생년월일
    ofcrspNm  : string ; // [05] 직책명
    postnCd   : string ; // [06] 직위코드
    entrnDt   : string ; // [07] 입사일자
    resgnDt   : string ; // [08] 퇴사일자
    resgnYn   : string ; // [09] 퇴사여부
    workPlace : string ; // [10] 근무 장소
    basePay   : number ; // [11] 기본급
    ofcrspPay : number ; // [12] 직책수당
    mealPay   : number ; // [13] 식대
    insrnPay  : number ; // [14] 보험료
    rsrchPay  : number ; // [15] 연구비
    drivePay  : number ; // [16] 자가운전보조비
    chldcPay  : number ; // [17] 보육비
    cmnctnPay : number ; // [18] 통신비
    extraPay  : number ; // [19] 기타금액
    irpPay    : number ; // [20] IRP 지원금
    inctvPay  : number ; // [21] 인센티브
    paySum    : number ; // [22] 지급합계

    bankNm    : string ; // [23] 은행명
    accntNo   : string ; // [24] 계좌번호
    telNo     : string ; // [25] 연락처
    emailAddr : string ; // [26] 이메일주소
};

// =================================================================
export const findStaffSalryInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT STAFF_ID   AS "staffId"   -- [01] 사번
      ,PAY_DAY    AS "payDay"    -- [02] 지급일 (DD)
      ,STAFF_NM   AS "staffNm"   -- [03] 성명
      ,BIRTH_DT   AS "birthDt"   -- [04] 생년월일
      ,OFCRSP_NM  AS "ofcrspNm"  -- [05] 직책명
      ,POSTN_CD   AS "postnCd"   -- [06] 직위코드
      ,ENTRN_DT   AS "entrnDt"   -- [07] 입사일자
      ,RESGN_DT   AS "resgnDt"   -- [08] 퇴사일자
      ,RESGN_YN   AS "resgnYn"   -- [09] 퇴사여부
      ,WORK_PLACE AS "workPlace" -- [10] 근무장소
      ,BASE_PAY   ::NUMERIC::INT AS "basePay"   -- [11] 기본급
      ,OFCRSP_PAY ::NUMERIC::INT AS "ofcrspPay" -- [12] 직책수당
      ,MEAL_PAY   ::NUMERIC::INT AS "mealPay"   -- [13] 식대
      ,INSRN_PAY  ::NUMERIC::INT AS "insrnPay"  -- [14] 보험료
      ,RSRCH_PAY  ::NUMERIC::INT AS "rsrchPay"  -- [15] 연구비
      ,DRIVE_PAY  ::NUMERIC::INT AS "drivePay"  -- [16] 자가운전보조비
      ,CHLDC_PAY  ::NUMERIC::INT AS "chldcPay"  -- [17] 보육비
      ,CMNCTN_PAY ::NUMERIC::INT AS "cmnctnPay" -- [18] 통신비
      ,EXTRA_PAY  ::NUMERIC::INT AS "extraPay"  -- [19] 기타금액
      ,IRP_PAY    ::NUMERIC::INT AS "irpPay"    -- [20] IRP 지원금
      ,INCTV_PAY  ::NUMERIC::INT AS "inctvPay"  -- [21] 인센티브
      ,(BASE_PAY + OFCRSP_PAY + MEAL_PAY + INSRN_PAY + RSRCH_PAY + DRIVE_PAY + CHLDC_PAY + CMNCTN_PAY + EXTRA_PAY + IRP_PAY + INCTV_PAY)::NUMERIC::INT
          AS "paySum"

      ,BANK_NM    AS "bankNm"    -- [22] 은행명
      ,ACCNT_NO   AS "accntNo"   -- [23] 계좌번호
      ,TEL_NO     AS "telNo"     -- [24] 연락처
      ,EMAIL_ADDR AS "emailAddr" -- [25] 이메일주소

  FROM SF001M1
${
SqlUtil.AddWhere(input, [
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