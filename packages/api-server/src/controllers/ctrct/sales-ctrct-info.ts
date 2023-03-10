// ===========================================================
//  매출계약기본정보 조회
// ===========================================================
// - 작성일: 2023. 03. 06
// - 작성자: 홍사민
// ===========================================================
// [기록]
// 2023. 03. 09.
// - JWT 인증 절차 추가
// ===========================================================
import { pgCurrent } from '../../config/db-config';
import { StringUtil } from '../../utils/string.util';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse } from "../../common/wrap-api-response";
import JwtRestService from '../../services/jwt-rest.service';

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
//  쿼리, I/O 정의 (or 서비스 파일 별도 분리)
// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;

// const queryService = makeQueryService<
//     QueryInput, 
//     QueryOutput
// >(
//     'Many',
//     `
// SELECT CTRCT_NO         AS "ctrctNo"       -- 계약번호
//       ,BSNTYP_NM        AS "bsntypNm"      -- 업종명
//       ,ORDER_COMPN      AS "orderCompn"    -- 발주사
//       ,CTRCT_COMPN      AS "ctrctCompn"    -- 계약사
//       ,PRJCT_NM         AS "prjctNm"       -- 프로젝트명
//       ,PRJCT_CONTN      AS "prjctContn"    -- 프로젝트내용
//       ,TOTAL_CTRCT_PRC  AS "totalCtrctPrc" -- 총계약금
//       ,CTRCT_TYPE_CD    AS "ctrctTypeCd"   -- 계약유형코드
//       ,CHNG_YN          AS "chngYn"        -- 변경여부
//       ,PAY_GB_CD        AS "payGbCd"       -- 지급구분코드
//       ,ISSUE_SCHD_GB_CD AS "issueSchdGbCd" -- 발행일구분코드
//       ,ISSUE_SCHD_DAY   AS "issueSchdDay"  -- 발행예정일
//       ,RVRS_ISSUE_YN    AS "rvrsIssueYn"   -- 역발행여부
//       ,DPST_SCHD_DAY    AS "dpstSchdDay"   -- 입금예정일
//       ,CTRCT_START_DT   AS "ctrctStartDt"  -- 계약시작일자
//       ,CTRCT_END_DT     AS "ctrctEndDt"    -- 계약종료일자

//   FROM SL001M1
//     `
// );

// =================================================================
export const salesCtrctInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Get-query', 
    async (input, headers) => 
    {
        await JwtRestService.verifyAccessTokenInHeader(headers);
        // console.log(input);

        const keys = Object.keys(input);
        let queryString = 
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
        `;

        const AddCond = (bucket: string[], input: ApiInput, key: string, keyName: keyof ApiInput & string, operator: '=' | '<' | '>' | 'LIKE') => {
            const valPart = operator === 'LIKE' ? `%${input[keyName]}%` : `${input[keyName]}`;
            if(key === keyName) {
                bucket.push(`      ${StringUtil.camelToLargeSnake(key)} ${operator} '${valPart}'`);
            }
        };

        // WHERE
        if(keys.length > 0) {
            queryString += '\n WHERE \n';
            const conditions = [] as string[];

            for(const key of keys) {
                AddCond(conditions, input, key, 'ctrctStartDt', '>');
                AddCond(conditions, input, key, 'ctrctEndDt', '<');
                AddCond(conditions, input, key, 'ctrctCompn', 'LIKE');
                AddCond(conditions, input, key, 'orderCompn', 'LIKE');
                AddCond(conditions, input, key, 'prjctNm', 'LIKE');
                AddCond(conditions, input, key, 'payGbCd', '=');
                AddCond(conditions, input, key, 'ctrctTypeCd', '=');
            }

            const whereString = conditions.join('AND \n') + '\n';
            queryString += whereString;
        }

        console.log(queryString);

        const qr = (await pgCurrent.query<ApiOutput>(queryString)).rows;

        return wrapApiResponse('Many', qr);

    }, 
);