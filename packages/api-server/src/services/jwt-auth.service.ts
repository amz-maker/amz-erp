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
import { TokenSet, UserAuth, UserRefresh } from "../common-types/jwt-auth";
import JwtUtil from "../utils/jwt.util";

export default class JwtAuthService {

    /**
     * 사용자 정보 검증
     * @error 사용자 정보가 유효하지 않은 경우
     * @returns void
     */
    private static async verifyUserAuth(userAuth: UserAuth): Promise<void> {

        const qr = await pgCurrent.query(`
            SELECT * 
              FROM US001M1
             WHERE USER_ID = $1 AND USER_PW = $2
        `, [userAuth.id, userAuth.pwHash]);

        const isVerified = (qr.rowCount > 0);
        
        if(!isVerified) {
            throw new Error(`Invalid User : ${userAuth.id}`);
        }
    }

    /**
     * 해당 유저의 리프레시 토큰 업데이트
     * @error 유저가 존재하지 않음
     */
    public static async updateRefreshToken(userRefresh: UserRefresh): Promise<void> {

        const qr = await pgCurrent.query(`
            UPDATE US001M1
               SET RFRSH_TOKEN = $1
             WHERE USER_ID = $2
         RETURNING *
        `, [userRefresh.refreshToken, userRefresh.id]);

        if(qr.rowCount === 0) {
            throw new Error(`Not Existent User ID: ${userRefresh.id}`);
        }
    }

    /**
     * 사용자 리프레시 토큰 유효성 검증
     */
    public static async checkRefreshToken(userRefresh: UserRefresh): Promise<boolean> {

        const qr = await pgCurrent.query(`
            SELECT * 
              FROM US001M1
             WHERE USER_ID = $1 AND RFRSH_TOKEN = $2
        `, [userRefresh.id, userRefresh.refreshToken]);

        return (qr.rowCount > 0);
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