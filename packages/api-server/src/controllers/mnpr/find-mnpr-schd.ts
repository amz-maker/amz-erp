// ===========================================================
//  인력투입계획조회
// ===========================================================
// - 작성일: 2023. 03. 22
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
    ctrctMhour    : number   ; // [09] 계약공수 (맨먼스 배열 요소 합)
    mnmArr        : number[] ; // [10] 맨먼스배열 (최대 36 길이의 배열)
    wtdrlSchdDt   : string   ; // [11] 철수예정일자
    staffGbCd     : string   ; // [12] 직원구분코드
    prchsSchdUprc : number   ; // [13] 매입예정단가
    prchsSchdPrc  : number   ; // [14] 매입예정금액
};

// =================================================================
export const findMnprSchd = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        // let queryString: StrictQuery<ApiOutput> = 
        let queryString = 
        `
SELECT SEQ_NO                        AS "seqNo"         -- [01] 순번 (계약번호 내 순번)
      ,LV1                           AS "lv1"           -- [02] 레벨1
      ,LV2                           AS "lv2"           -- [03] 레벨2
      ,LV3                           AS "lv3"           -- [04] 레벨3
      ,STAFF_NM                      AS "staffNm"       -- [05] 직원이름
      ,POSTN_CD                      AS "postnCd"       -- [06] 직위코드
      ,MNPR_GRD                      AS "mnprGrd"       -- [07] 인력등급
      ,CMTMT_SCHD_DT                 AS "cmtmtSchdDt"   -- [08] 투입예정일자
      ,CTRCT_MHOUR                   AS "ctrctMhour"    -- [09] 계약공수 (맨먼스 배열 요소 합)
      ,MNM_ARR                       AS "mnmArr"        -- [10] 맨먼스배열 (최대 36 길이의 배열)
      ,WTDRL_SCHD_DT                 AS "wtdrlSchdDt"   -- [11] 철수예정일자
      ,STAFF_GB_CD                   AS "staffGbCd"     -- [12] 직원구분코드
      ,PRCHS_SCHD_UPRC::NUMERIC::INT AS "prchsSchdUprc" -- [13] 매입예정단가
      ,PRCHS_SCHD_PRC ::NUMERIC::INT AS "prchsSchdPrc"  -- [14] 매입예정금액

  FROM MP001M1
        ` as const;
        const qs = queryString
        +
        SqlUtil.AddWhere(input, [
            ['ctrctNo', '='],
        ])
        +
`
ORDER BY SEQ_NO ASC
`
        ;

        const qr = (await pgCurrent.query<ApiOutput>(qs)).rows;

        return wrapApiResponse('Many', qr);

    }, 
);