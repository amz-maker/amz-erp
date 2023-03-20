// ===========================================================
//  매출발행/입금체크 조회
// ===========================================================
// - 작성일: 2023. 03. 20.
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - 요건: 매출발행 입금내역관리 - 매출발행/입금체크 등록
// - INPUT: 계약번호
// - OUTPUT: 회차, 세금계산서 발행예정일, 발행금액, 입금예정일, 메모, 발행일자, 입금일자, 입금금액, 비고, 진행상태, 정상여부체크
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
    issueDt      : string; // [06] 발행일자
    dpstDt       : string; // [07] 입금일자
    dpstPrc      : string; // [08] 입금금액
    note         : string; // [09] 비고
    statGbCd     : string; // [10] 상태구분코드
    errorGbCd    : string; // [11] 오류구분코드
};

// =================================================================
export const findSalesIssueDpstCheck = makeFarestFrame<ApiInput, ApiOutput>(
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
      ,ISSUE_DT       AS "issueDt"       -- [06] 발행일자
      ,DPST_DT        AS "dpstDt"        -- [07] 입금일자
      ,DPST_PRC       AS "dpstPrc"       -- [08] 입금금액
      ,NOTE           AS "note"          -- [09] 비고
      ,STAT_GB_CD     AS "statGbCd"      -- [10] 상태구분코드
      ,ERROR_GB_CD    AS "errorGbCd"     -- [11] 오류구분코드

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