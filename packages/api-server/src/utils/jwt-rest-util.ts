// ===========================================================
//  JWT RestAPI 활용 유틸
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
import { AccessToken, RefreshToken, TokenSet } from "../common-types/jwt-auth";
import JwtUtil from "./jwt-util";

export default class JwtRestUtil {

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
     * @returns void
     */
    public static verifyHeaderAccessToken(header: any): void 
    {
        console.log(header);

        const accessToken = JwtRestUtil.getAccessTokenFromHeader(header);
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
        switch(JwtUtil.verifyToken(accessToken)) {
            case 'Valid': break;
            case 'Expired':
                throw new Error("Expired Access Token");
            
            default:
                throw new Error("Invalid Access Token");
        }
    }

    // 액세스 토큰 재발급
    /**
     * 헤더에서 액세스 토큰, 리프레시 토큰 꺼내어 액세스 토큰 재발급
     * @error 액세스 토큰, 리프레시 토큰이 유효하지 않은 경우
     * @returns 액세스 토큰 문자열
     */
    public static reissueAccessToken(header: any): AccessToken
    {
        const accessToken  = JwtRestUtil.getAccessTokenFromHeader(header);
        const refreshToken = JwtRestUtil.getRefreshTokenFromHeader(header);
        const va = (accessToken  !== undefined);
        const vr = (refreshToken !== undefined);
        const ia = !va;
        const ir = !vr;

        if(va && vr) {
            return JwtUtil.reissueAccessToken({
                access: accessToken,
                refresh: refreshToken,
            });
        }
        else {
            if(ia && ir) throw Error("Invalid Token : Access, Refresh");
            else if(ia)  throw Error("Invalid Token : Access");
            else         throw Error("Invalid Token : Refresh");
        }
    }
}