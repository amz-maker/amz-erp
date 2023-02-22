// ===========================================================
//  [ // TODO ] 라우팅 정의
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { FastifyInstance} from "fastify";
import * as Controllers from "../controllers";
import { routeTree } from "./route-tree";
import { farest} from "../common/make-farest";

export default function routes(server: FastifyInstance, opts: any, next: any) {
  
  farest(server, routeTree.user.find, Controllers.getUserFind);     // http://127.0.0.1:8001/user/find/123
  farest(server, routeTree.user.search, Controllers.getUserSearch); // http://127.0.0.1:8001/user/search?in=123
  farest(server, routeTree.user.login, Controllers.postUserLogin);  // http://127.0.0.1:8001/user/login  // body: { "in":123 }
  farest(server, routeTree.user.modify, Controllers.putUserModify); // http://127.0.0.1:8001/user/modify // body: { "in":123 }

  next();
}


