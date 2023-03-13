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
  
  // routeFarest(server, '/user/complex', Controllers.getUserComplex);
  // routeFarest(server, '/user/find',    Controllers.getUserFind);   // http://127.0.0.1:8001/user/find/123
  // routeFarest(server, '/user/search',  Controllers.getUserSearch); // http://127.0.0.1:8001/user/search?in1=100&in2=200}
  // routeFarest(server, '/user/modify',  Controllers.putUserModify); // http://127.0.0.1:8001/user/modify // body: { "in":123 }
  
  routeFarest(server, '/ctrct/find-sales-ctrct-info',  Controllers.findSalesCtrctInfo); // 매출계약기본정보조회
  routeFarest(server, '/user/login',  Controllers.userLogin);
  routeFarest(server, '/user/logout',  Controllers.userLogout);
  routeFarest(server, '/user/reissue-access-token',  Controllers.reissueAccessToken);

  routeFarest(server, '/test/jwt',  Controllers.testJwt); // 헤더 JWT 토큰 검증

  next();
}


