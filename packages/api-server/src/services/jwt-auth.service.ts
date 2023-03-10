// ===========================================================
//  JWT 인증 서비스
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
// [기록]
// 2023. 03. 10.
// - 유틸리티 -> 서비스로 이동
// ===========================================================
import { pgCurrent } from "../config/db-config";
import { AccessToken, TokenSet, UserAuth, UserRefresh } from "../common-types/jwt-auth";
import JwtUtil from "../utils/jwt.util";

export default class JwtAuthService {

    /**
     * 사용자 정보 검증
     * @error 유저 정보가 유효하지 않은 경우
     * @returns void
     */
    private static async verifyUserAuth(userAuth: UserAuth): Promise<void> {
        const isVerified = JwtAuthService.checkUser(userAuth);

        if(!isVerified) {
            throw new Error(`Not Valid User : ${userAuth.id}`);
        }
    }

    /**
     * 해당 유저의 리프레시 토큰 업데이트
     */
    public static async updateRefreshToken(userRefresh: UserRefresh): Promise<void> {

        // FIXME
    }

    /**
     * 사용자 로그인 정보 유효성 검증
     */
    public static async checkUser(userAuth: UserAuth): Promise<boolean> {

        const qr = await pgCurrent.query(`

            SELECT * FROM US001M1
            WHERE USER_ID = $1 AND USER_PW = $2
        `, [userAuth.id, userAuth.pwHash])

        // FIXME: 유저 테이블 구축, SELECT 쿼리를 통해 유저 정보 검증
        return true;
    }

    /**
     * 사용자 리프레시 토큰 유효성 검증
     */
    public static async checkRefreshToken(userRefresh: UserRefresh): Promise<boolean> {

        // FIXME: (ID, Refresh Token) 검증
        return true;
    }
    
    /**
     * Access Token, Refresh Token 발급
     * @error 유저 정보가 유효하지 않은 경우
     * @returns - { access: 토큰 문자열, refresh: 토큰 문자열 }
     */
    public static async issueTokens( userAuth: UserAuth ): Promise<TokenSet> {

        await JwtAuthService.verifyUserAuth(userAuth);
        const newTokenSet = JwtUtil.issueTokens(userAuth.id);

        return newTokenSet;
    }
}