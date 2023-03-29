// ===========================================================
//  인력투입실적상세정보조회
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
import { StrictQuery } from 'common/make-query-service';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    ctrctNo: string; // 계약번호 (매출계약정보 FK)
};

type ApiOutput = {
    seqNo         : number   ; // [01] 순번 (계약번호 내 순번)
    lv1           : string   ; // [02] 레벨1
    lv2           : string   ; // [03] 레벨2
    lv3           : string   ; // [04] 레벨3
    staffNm       : string   ; // [05] 직원이름
    postnCd       : string   ; // [06] 직위코드
    mnprGrd       : string   ; // [07] 인력등급
    cmtmtSchdDt   : string   ; // [08] 투입예정일자
    ctrctMhour    : number   ; // [09] 계약공수 (인력투입계획정보 계약공수 참조)
    mnmArr        : number[] ; // [10] 맨먼스배열 (월별 실투입공수 배열)
    wtdrlSchdDt   : string   ; // [11] 철수예정일자
    staffGbCd     : string   ; // [12] 직원구분코드
    prchsSchdUprc : number   ; // [13] 매입예정단가
    prchsSchdPrc  : number   ; // [14] 매입예정금액
    prchsUprc     : number   ; // [15] 매입단가
    prchsPrc      : number   ; // [16] 매입금액
    cmtmtDt       : string   ; // [17] 투입일자 (실제투입일)
    wtdrlDt       : string   ; // [18] 철수일자 (실제철수일)
    chngRsn       : string   ; // [19] 변경사유
    ctrctUrl      : string   ; // [20] 계약서URL
};

// =================================================================
export const findMnprCmtmtDetl = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const qs = 
`
SELECT SEQ_NO          AS "seqNo"         -- [01] 순번 (계약번호 내 순번)
      ,LV1             AS "lv1"           -- [02] 레벨1
      ,LV2             AS "lv2"           -- [03] 레벨2
      ,LV3             AS "lv3"           -- [04] 레벨3
      ,STAFF_NM        AS "staffNm"       -- [05] 직원이름
      ,POSTN_CD        AS "postnCd"       -- [06] 직위코드
      ,MNPR_GRD        AS "mnprGrd"       -- [07] 인력등급
      ,CMTMT_SCHD_DT   AS "cmtmtSchdDt"   -- [08] 투입예정일자
      ,CTRCT_MHOUR     AS "ctrctMhour"    -- [09] 계약공수 (인력투입계획정보 계약공수 참조)
      ,MNM_ARR         AS "mnmArr"        -- [10] 맨먼스배열 (월별 실투입공수 배열)
      ,WTDRL_SCHD_DT   AS "wtdrlSchdDt"   -- [11] 철수예정일자
      ,STAFF_GB_CD     AS "staffGbCd"     -- [12] 직원구분코드
      ,PRCHS_SCHD_UPRC AS "prchsSchdUprc" -- [13] 매입예정단가
      ,PRCHS_SCHD_PRC  AS "prchsSchdPrc"  -- [14] 매입예정금액
      ,PRCHS_UPRC      AS "prchsUprc"     -- [15] 매입단가
      ,PRCHS_PRC       AS "prchsPrc"      -- [16] 매입금액
      ,CMTMT_DT        AS "cmtmtDt"       -- [17] 투입일자 (실제투입일)
      ,WTDRL_DT        AS "wtdrlDt"       -- [18] 철수일자 (실제철수일)
      ,CHNG_RSN        AS "chngRsn"       -- [19] 변경사유
      ,CTRCT_URL       AS "ctrctUrl"      -- [20] 계약서URL

  FROM MP001L1
${
SqlUtil.AddWhere(input, [
    ['ctrctNo', '='],
])
}
`
        ;

        // console.log(qs);

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows as ApiOutput[];

        return wrapApiResponse('Many', qr);

    }, 
);