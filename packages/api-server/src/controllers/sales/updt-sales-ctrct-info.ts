// ===========================================================
//  매출계약기본정보 수정
// ===========================================================
// - 작성일: 2023. 04. 07
// - 작성자: 박건률
// ===========================================================

import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import { AccessToken, RefreshToken, TokenSet } from '../../common-types/jwt-auth';
import JwtRestService from '../../services/jwt-rest.service';
import JwtAuthService from '../../services/jwt-auth.service';
import SqlUtil from '../../utils/sql.util';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
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
    evnet         : string; // update이벤트(C,U,D)
};

type ApiOutput = {
    success: string
};

// =================================================================
//  쿼리, I/O 정의 (or 서비스 파일 별도 분리)
// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;


function getCreateSql(input : ApiInput){
    const queryString = "";
}

function getUpdateSql(){

}

function getDeleteSql(){

}

// =================================================================
export const updtSalesCtrctInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Post', 
    async (input, headers) => 
    {
        JwtRestService.verifyAccessTokenFromHeader(headers);

        const sql = getCreateSql(input)
        

        return wrapApiResponse('MustOne', {
            success: input.ctrctNo
        });
    }, 
);