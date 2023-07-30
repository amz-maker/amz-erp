// ===========================================================
//  매출계약기본정보 수정
// ===========================================================
// - 작성일: 2023. 04. 07
// - 작성자: 박건률
// ===========================================================

import { pgCurrent } from '../../config/db-config';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import { AccessToken, RefreshToken, TokenSet } from '../../common-types/jwt-auth';
import JwtRestService from '../../services/jwt-rest.service';
import JwtAuthService from '../../services/jwt-auth.service';
import SqlUtil from '../../utils/sql.util';
import PgUtil from '../../utils/pg.util';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    createData : TableColumn[];
    updateData : TableColumn[];
    deleteData : TableColumn[];
};

type TableColumn = {
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
}

type ApiOutput = {
    resInsert: number,
    resUpdate: number,
    resDelete: number,
};

// =================================================================
//  쿼리, I/O 정의 (or 서비스 파일 별도 분리)
// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;
type PkOutput = {
    attname : string;
}

// =================================================================
export const updtSalesCtrctInfo = makeFarestFrame<ApiInput, ApiOutput>(
    'Post', 
    async (input, headers) => 
    {
        const tableName = "SL001M1"
        JwtRestService.verifyAccessTokenFromHeader(headers);

        // console.log("updtSalesCtrctInfo - ",input)
        // const pkQr = SqlUtil.findTablePrimaryKeySql("test.m_test")
        const pkQr = SqlUtil.findTablePrimaryKeySql(tableName)
        const pk = (await pgCurrent.query<PkOutput>(pkQr)).rows;
        // console.log("pk - ", pk)
        const pkNames = pk.map(item => item.attname);

        const resInsert = await PgUtil.insertObjectIntoTable({
            tableName: tableName,
            data: input.createData ?? []
        })

        const resUpdate = await PgUtil.updateObjectSetTable({
            tableName: tableName,
            data:input.updateData ?? [],
            pkNames: pkNames
        })
        
        const resDelete = await PgUtil.deleteObjectFromTable({
            tableName: tableName,
            data: input.deleteData ?? [],
            pkNames: pkNames
        })


        // PgUtil.updateObjectIntoTable({tableName:"SL001M1",pkNames:pkNames,data:{a:1,b:2,c:3,ctrctNo:"1234"}})
        

        // const qr = (await pgCurrent.query<ApiOutput>(sql_1)).rows;

        // if(input.rowEvent == "U")
        //     update(prikey = qr)
        // else if(input.rowEvent == "D")
        //     delete(prikey = qr)

        return wrapApiResponse('MustOne', {
            resInsert,
            resUpdate,
            resDelete,
        });
    }, 
);