// ===========================================================
//  데이터베이스 활용 인증 유틸리티
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
import { AccessToken, TokenSet, UserAuth, UserRefresh } from "../common-types/jwt-auth";

export default class DbAuthUtil {

    /**
     * 사용자 로그인 정보 유효성 검증
     */
    public static checkUser(userAuth: UserAuth): boolean {

        // FIXME: 유저 테이블 구축, SELECT 쿼리를 통해 유저 정보 검증
        return true;
    }

    /**
     * 사용자 리프레시 토큰 유효성 검증
     */
    public static checkRefreshToken(userRefresh: UserRefresh) {

        // FIXME: (ID, Refresh Token) 검증
        return true;
    }
}