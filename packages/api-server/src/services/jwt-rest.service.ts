// ===========================================================
//  JWT RestAPI 활용 서비스
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
// [설명]
// - HTTP 헤더 오브젝트를 전달받아 처리하는 함수 모음
// ===========================================================
// [기록]
// 2023. 03. 10.
// - 유틸리티 -> 서비스로 이동
// ===========================================================
import { AccessToken, JwtPayload, RefreshToken } from "../common-types/jwt-auth";
import JwtUtil from "../utils/jwt.util";
import JwtAuthService from "./jwt-auth.service";

export default class JwtRestService {

    private static getAccessTokenFromHeader(header: any): AccessToken | undefined {
        return header['access'] ?? 
               header['Access'] ?? 
               header['accesstoken'] ?? 
               header['accessToken'] ?? 
               header['AccessToken'] ?? 
               header['access-token'] ?? 
               header['access-Token'] ?? 
               header['Access-token'] ?? 
               header['Access-Token'] ?? 
        undefined;
    }

    private static getRefreshTokenFromHeader(header: any): RefreshToken | undefined {
        return header['refresh'] ?? 
               header['Refresh'] ?? 
               header['refreshtoken'] ?? 
               header['refreshToken'] ?? 
               header['RefreshToken'] ?? 
               header['refresh-token'] ?? 
               header['refresh-Token'] ?? 
               header['Refresh-token'] ?? 
               header['Refresh-Token'] ?? 
        undefined;
    }

    /**
     * 헤더에서 액세스 토큰 꺼내어 검증
     * 유효한 경우, 아무런 동작 하지 않음
     * @error 액세스 토큰이 없거나 유효하지 않은 경우
     * @returns 액세스 토큰 페이로드
     */
    public static verifyAccessTokenFromHeader(header: any): JwtPayload 
    {
        console.log(header);

        const accessToken = JwtRestService.getAccessTokenFromHeader(header);
        if(accessToken === undefined) {
            throw new Error("No Access Token in Header")
        }

        // 리프레시 토큰을 받음
        if(JwtUtil.isRefreshToken(accessToken)) {
            throw new Error("Given Token is Refresh Token");
        }

        // 알 수 없는 토큰을 받음
        if(!JwtUtil.isAccessToken(accessToken)) {
            throw new Error("Given Token is NOT Access Token");
        }

        // 액세스 토큰을 받음
        switch(JwtUtil.checkTokenValidation(accessToken)) {
            case 'Valid': 
                return JwtUtil.decodeToken(accessToken);
                
            case 'Expired':
                throw new Error("Expired Access Token");
            
            default:
                throw new Error("Invalid Access Token");
        }
    }

    /**
     * 헤더에서 액세스 토큰, 리프레시 토큰 꺼내어 액세스 토큰 재발급
     * @error [1] 액세스 토큰, 리프레시 토큰이 유효하지 않은 경우
     * @error [2] DB의 유저 리프레시 토큰이 일치하지 않는 경우
     * @returns 액세스 토큰 문자열
     */
    public static async reissueAccessTokenFromHeader(header: any): Promise<AccessToken>
    {
        const accessToken  = JwtRestService.getAccessTokenFromHeader(header);
        const refreshToken = JwtRestService.getRefreshTokenFromHeader(header);
        const va = (accessToken  !== undefined);
        const vr = (refreshToken !== undefined);
        const ia = !va;
        const ir = !vr;

        if(ia && ir) throw Error("Invalid Token : Access, Refresh");
        if(ia)       throw Error("Invalid Token : Access");
        if(ir)       throw Error("Invalid Token : Refresh");

        // 토큰 종류 검증
        if(!JwtUtil.isAccessToken(accessToken))   throw new Error("Your Access Token is NOT Access Token");
        if(!JwtUtil.isRefreshToken(refreshToken)) throw new Error("Your Refresh Token is NOT Refresh Token");

        // 리프레시 토큰 검증
        const [refreshStatus, decodedRefresh] = JwtUtil.verifyToken(refreshToken);
        if(refreshStatus === "Valid") {
            const id = decodedRefresh!.aud;
            const dbCheck = await JwtAuthService.checkRefreshToken({ id, refreshToken });

            if(dbCheck) {

                // 재발급
                return JwtUtil.reissueAccessToken({
                    access: accessToken,
                    refresh: refreshToken,
                });
            }
            else {
                // DB내 리프레시 토큰과 불일치
                throw new Error("You Are Trying to Use Deleted Refresh Token");
            }
        }
        else {
            throw new Error("Expired Refresh Token");
        }

    }
}