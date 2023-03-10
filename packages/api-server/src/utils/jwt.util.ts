// ===========================================================
//  JWT 인증 유틸리티
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
// [기록]
// 2023. 03. 10.
// - 책임 분리: 유저 검증 부분은 모두 DB 서비스로 분리
// ===========================================================
import "dotenv/config";
import { AccessToken, JwtPayload, JwtToken, JwtVerifyResult, RefreshToken, TokenSet, UserAuth } from "../common-types/jwt-auth";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default class JwtUtil {

    private static options = {
        issuedFrom   : process.env.JWT_ISSUER!,
        accessExpire : process.env.JWT_ACCESS_EXPIRE!,
        refreshExpire: process.env.JWT_REFRESH_EXPIRE!,
        signAlgorithm: process.env.JWT_SIGN_ALGORITHM! as jwt.Algorithm,
        /*
        issuedFrom: 'Ecredit',
        accessExpire: '2h',
        refreshExpire: '7d',
        signAlgorithm: 'HS256',
        */
    } as const;

    /**
     * 해당 토큰이 액세스 토큰인지 여부 검증
     * @error JWT 디코드 실패 에러
     * @returns boolean
     */
    public static decodeToken(token: JwtToken): JwtPayload {
        
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            return decoded;
        }
        catch {
            throw new Error("Token Decode Error - Invalid Token");
        }
    }

    /**
     * 토큰 검증
     * @returns (1) ["Valid"   | "Expired",    JwtPayload]
     * @returns (2) ["Invalid" | "Unexpected", undefined]
     */
    public static verifyToken(token: JwtToken): [JwtVerifyResult, JwtPayload | undefined] { 

        let decoded = {} as any;

        try {
            decoded = jwt.decode(token);
            jwt.verify(token, process.env.JWT_SECRET!);
            return ['Valid', decoded as JwtPayload];

        } catch(e) {

            // [1] 만료
            if(e instanceof TokenExpiredError) {
                return ['Expired', decoded as JwtPayload];
            } 
            // [2] 변조
            else if(e instanceof JsonWebTokenError) {
                return ['Invalid', undefined];
            }
            // [3] 기타
            else {
                return ['Unexpected', undefined];
            }
        }
    }

    /**
     * 해당 토큰이 액세스 토큰인지 여부 검증
     * @error JWT 디코드 실패 에러
     * @returns boolean
     */
    public static isAccessToken(token: JwtToken): boolean {
        
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            return decoded.knd === 'Access';
        }
        catch {
            throw new Error("Token Decode Error - Invalid Token");
        }
    }

    /**
     * 해당 토큰이 리프레시 토큰인지 여부 검증
     * @error JWT 디코드 실패 에러
     * @returns boolean
     */
    public static isRefreshToken(token: JwtToken): boolean {
        
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            return decoded.knd === 'Refresh';
        }
        catch {
            throw new Error("Token Decode Error -  Invalid Token");
        }
    }

    /**
     * 새로운 토큰 발행
     * @returns - 토큰 문자열
     */
    private static _issueToken(audience: string, kind: 'Access' | 'Refresh'): JwtToken {

        const payload: JwtPayload = {
            iss: JwtUtil.options.issuedFrom,
            knd: kind,
            aud: audience,
        };

        const token: AccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            algorithm: JwtUtil.options.signAlgorithm,
            expiresIn: JwtUtil.options.accessExpire,
        });

        return token;
    }

    /**
     * Access Token 발행
     * @prerequisite 사용자 인증 필요
     * @returns - 토큰 문자열
     */
    public static issueAccessToken(audience: string): AccessToken {
        return this._issueToken(audience, 'Access');
    }

    /**
     * Refresh Token 발행
     * @prerequisite 사용자 인증 필요
     * @returns - 토큰 문자열
     */
    public static issueRefreshToken(audience: string): RefreshToken {
        return this._issueToken(audience, 'Refresh');
    }

    /**
     * Access Token, Refresh Token 발급
     * @prerequisite 사용자 인증 필요
     * @error 유저 정보가 유효하지 않은 경우
     * @returns - { access: 토큰 문자열, refresh: 토큰 문자열 }
     */
    public static issueTokens(audience: string): TokenSet {

        return {
            access: JwtUtil.issueAccessToken(audience),
            refresh: JwtUtil.issueRefreshToken(audience),
        }
    }

    /**
     * Access Token 검증
     * @returns (1) ["Valid"   | "Expired",    JwtPayload]
     * @returns (2) ["Invalid" | "Unexpected", undefined]
     */
    public static checkTokenValidation( accessToken: AccessToken ): JwtVerifyResult {
        return JwtUtil.verifyToken(accessToken)[0];
    }

    /**
     * Access Token 재발급
     * - 만료된 Access Token, 만료되지 않은 Refresh Token 필요
     * @error (1) 토큰이 유효하지 않은 경우
     * @error (2) 리프레시 토큰이 리프레시 토큰이 아님
     * @returns 토큰 문자열
     */
    public static reissueAccessToken( tokenSet: TokenSet ) : AccessToken {

        const [accessVerified, accessDecoded] = JwtUtil.verifyToken(tokenSet.access);
        const [refreshVerified, ] = JwtUtil.verifyToken(tokenSet.refresh);

        if((accessVerified === 'Expired' || accessVerified === 'Valid') && 
            refreshVerified === 'Valid') 
        {
            const decoded = accessDecoded!;
            const payload: JwtPayload = {
                iss: decoded.iss,
                aud: decoded.aud,
                knd: decoded.knd,
            };

            // 리프레시 토큰이 리프레시 토큰인지 여부 검증
            if(!JwtUtil.isRefreshToken(tokenSet.refresh)) {
                throw new Error("Given Refresh Token is NOT Refresh Token");
            }

            // 새로운 액세스 토큰 발급
            return jwt.sign(payload, process.env.JWT_SECRET!, {
                algorithm: JwtUtil.options.signAlgorithm,
                expiresIn: JwtUtil.options.accessExpire,
            });
        }

        throw new Error("Invalid Token");
    }
}