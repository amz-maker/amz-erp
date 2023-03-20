// ===========================================================
//  매출발행/입금내역 조회
// ===========================================================
// - 작성일: 2023. 03. 20.
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - 요건: 매출계약 정보관리 시트 - 매출발행/입금예정내역 등록
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
    ctrctNo : string; // 계약번호
};

type ApiOutput = {
    seqNo        : number; // [01] 순번(PK)
    issueSchdDt  : string; // [02] 발행예정일자
    issueSchdPrc : string; // [03] 발행예정금액
    dpstSchdDt   : string; // [04] 입금예정일자
    memo         : string; // [05] 메모
    statGbCd     : string; // [06] 상태구분코드
};

// =================================================================
export const findSalesIssueDpstSchd = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const queryString = 
        `
SELECT SEQ_NO         AS "seqNo"         -- [01] 순번
      ,ISSUE_SCHD_DT  AS "issueSchdDt"   -- [02] 발행예정일자
      ,ISSUE_SCHD_PRC AS "issueSchdPrc"  -- [03] 발행예정금액
      ,DPST_SCHD_DT   AS "dpstSchdDt"    -- [04] 입금예정일자
      ,MEMO           AS "memo"          -- [05] 메모
      ,STAT_GB_CD     AS "statGbCd"      -- [06] 상태구분코드

  FROM SL001L1
        `
        + 
        SqlUtil.AddWhere(input, [
            ['ctrctNo', '='],
        ])
        +
        `
ORDER BY 1 ASC    -- 순번
        `
        ;

        console.log(queryString);
        const qr = (await pgCurrent.query<ApiOutput>(queryString)).rows;

        return wrapApiResponse('Many', qr);

    }, 
);