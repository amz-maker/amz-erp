// ===========================================================
//  기타매입정보조회
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
    payType      : string ; // 지급유형
    payDay       : string ; // 지급일(DD)
    bankNm       : string ; // 결제은행
};

// 기타매입정보
type ApiOutput = {
    seqNo        : number ; // [01] 순번
    payDay       : string ; // [02] 지급일 (월별 지급일(DD))
    payType      : string ; // [03] 지급유형
    detlContn    : string ; // [04] 세부사항
    note         : string ; // [05] 비고 (참고사항)
    bankNm       : string ; // [06] 은행명 (결제은행)
    accntNo      : string ; // [07] 계좌번호 (결제계좌번호)
    accntHoldrNm : string ; // [08] 예금주명
    prcChngCd    : string ; // [09] 금액변동코드
    pymntMethd   : string ; // [10] 결제방법
    stdPrc       : number ; // [11] 기준금액 (현재 기준금액)
};

// =================================================================
export const findEtcPrchsInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT SEQ_NO         AS "seqNo"        -- [01] 순번
      ,PAY_DAY        AS "payDay"       -- [02] 지급일 (월별 지급일(DD))
      ,PAY_TYPE       AS "payType"      -- [03] 지급유형
      ,DETL_CONTN     AS "detlContn"    -- [04] 세부사항
      ,NOTE           AS "note"         -- [05] 비고 (참고사항)
      ,BANK_NM        AS "bankNm"       -- [06] 은행명 (결제은행)
      ,ACCNT_NO       AS "accntNo"      -- [07] 계좌번호 (결제계좌번호)
      ,ACCNT_HOLDR_NM AS "accntHoldrNm" -- [08] 예금주명
      ,PRC_CHNG_CD    AS "prcChngCd"    -- [09] 금액변동코드
      ,PYMNT_METHD    AS "pymntMethd"   -- [10] 결제방법
      ,STD_PRC        AS "stdPrc"       -- [11] 기준금액 (현재 기준금액)

  FROM PC001M1
${
SqlUtil.AddWhere(input, [
    ['payType', 'LIKE'],
    ['payDay', '='],
    ['bankNm', 'LIKE'],
])
}
`
        ;

        console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);