// ===========================================================
//  [ // TODO ] 라우팅 정의
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { FastifyInstance} from "fastify";
import * as Controllers from "../controllers";
import { routeFarest} from "../common/make-farest";

export default function routes(server: FastifyInstance, opts: any, next: any) {
  
  // == user ==
  routeFarest(server, '/user/login',  Controllers.userLogin);
  routeFarest(server, '/user/logout',  Controllers.userLogout);
  routeFarest(server, '/user/reissue-access-token',  Controllers.reissueAccessToken);

  // == sales ==
  routeFarest(server, '/sales/find-sales-ctrct-info',        Controllers.findSalesCtrctInfo);       // 매출계약기본정보조회
  routeFarest(server, '/sales/find-sales-issue-dpst-schd',   Controllers.findSalesIssueDpstSchd);   // 매출발행입금예정내역조회
  routeFarest(server, '/sales/find-sales-issue-dpst-check',  Controllers.findSalesIssueDpstCheck);  // 매출발행입금체크조회
  routeFarest(server, '/sales/find-sales-issue-dpst-montly', Controllers.findSalesIssueDpstMontly); // 매출발행입금내역월별조회

  // == mnpr ==
  routeFarest(server, '/mnpr/find-mnpr-schd', Controllers.findMnprSchd); // 인력투입계획조회
  routeFarest(server, '/mnpr/find-mnpr-cmtmt-info', Controllers.findMnprCmtmtInfo); // 인력투입실적기본정보조회
  routeFarest(server, '/mnpr/find-mnpr-cmtmt-detl', Controllers.findMnprCmtmtDetl); // 인력투입실적상세정보조회

  // == pchs ==
  routeFarest(server, '/pchs/find-staff-salry-info', Controllers.findStaffSalryInfo); // 임직원급여기본정보조회
  routeFarest(server, '/pchs/find-staff-payrl', Controllers.findStaffPayrl); // 임직원급여대장조회
  routeFarest(server, '/pchs/find-frlnc-salry-info', Controllers.findFrlncSalryInfo); // 계약직원급여기본정보조회
  routeFarest(server, '/pchs/find-frlnc-payrl', Controllers.findFrlncPayrl); // 계약직원급여대장조회
  
  // == test ==
  routeFarest(server, '/test/jwt',  Controllers.testJwt); // 헤더 JWT 토큰 검증
  // routeFarest(server, '/user/complex', Controllers.getUserComplex);
  // routeFarest(server, '/user/find',    Controllers.getUserFind);   // http://127.0.0.1:8001/user/find/123
  // routeFarest(server, '/user/search',  Controllers.getUserSearch); // http://127.0.0.1:8001/user/search?in1=100&in2=200}
  // routeFarest(server, '/user/modify',  Controllers.putUserModify); // http://127.0.0.1:8001/user/modify // body: { "in":123 }
  
  next();
}


