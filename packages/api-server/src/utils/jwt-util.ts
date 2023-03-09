// ===========================================================
//  JWT 인증 유틸리티
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
import "dotenv/config";
import { AccessToken, JwtPayload, JwtToken, JwtVerifyResult, RefreshToken, TokenSet, UserAuth } from "../common-types/jwt-auth";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import DbUtil from "./db-util";

export default class JwtUtil {

    private static options = {
        issuedFrom: 'Ecredit',
        accessExpire: '10s',
        refreshExpire: '7d',
        signAlgorithm: 'HS256',
    } as const;

    /**
     * 사용자 정보 검증
     * @error 유저 정보가 유효하지 않은 경우
     * @returns void
     */
    private static verifyUserAuth(userAuth: UserAuth): void {
        const isVerified = DbUtil.checkUser(userAuth);

        if(!isVerified) {
            throw new Error(`Not Valid User : ${userAuth.id}`);
        }
    }

    /**
     * 토큰 검증
     * @returns (1) ["Valid"   | "Expired",    JwtPayload]
     * @returns (2) ["Invalid" | "Unexpected", undefined]
     */
    private static verifyTokenInternal(token: JwtToken): [JwtVerifyResult, JwtPayload | undefined] { 

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
            throw new Error("Access Token Validation - Decode Error")
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
            throw new Error("Refresh Token Validation - Decode Error")
        }
    }

    /**
     * Access Token 발행
     * @error 유저 정보가 유효하지 않은 경우
     * @returns - 토큰 문자열
     */
    public static issueAccessToken(userAuth: UserAuth): AccessToken {

        JwtUtil.verifyUserAuth(userAuth);
        
        const payload: JwtPayload = {
            iss: JwtUtil.options.issuedFrom,
            knd: 'Access',
            aud: userAuth.id,
        };

        const token: AccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            algorithm: JwtUtil.options.signAlgorithm,
            expiresIn: JwtUtil.options.accessExpire,
        });

        return token;
    }

    /**
     * Refresh Token 발행
     * @error 유저 정보가 유효하지 않은 경우
     * @returns - 토큰 문자열
     */
    public static issueRefreshToken(userAuth: UserAuth): RefreshToken {

        JwtUtil.verifyUserAuth(userAuth);
        
        const payload: JwtPayload = {
            iss: JwtUtil.options.issuedFrom,
            knd: 'Refresh',
            aud: userAuth.id,
        };

        const token: RefreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            algorithm: JwtUtil.options.signAlgorithm,
            expiresIn: JwtUtil.options.refreshExpire,
        });

        return token;
    }

    /**
     * Access Token, Refresh Token 발급
     * @error 유저 정보가 유효하지 않은 경우
     * @returns - { access: 토큰 문자열, refresh: 토큰 문자열 }
     */
    public static issueTokens( userAuth: UserAuth ): TokenSet {
        // 1. 유저 인증
        JwtUtil.verifyUserAuth(userAuth);

        // 2. 페이로드 정의
        const commonPayload = {
            iss: JwtUtil.options.issuedFrom,
            aud: userAuth.id,
        };
        const accessPayload: JwtPayload = {
            ...commonPayload,
            knd: 'Access',
        };
        const refreshPayload: JwtPayload = {
            ...commonPayload,
            knd: 'Refresh',
        };

        // 3. 토큰 생성
        const accessToken: AccessToken = jwt.sign(accessPayload, process.env.JWT_SECRET!, {
            algorithm: JwtUtil.options.signAlgorithm,
            expiresIn: JwtUtil.options.accessExpire,
        });
        const refreshToken: RefreshToken = jwt.sign(refreshPayload, process.env.JWT_SECRET!, {
            algorithm: JwtUtil.options.signAlgorithm,
            expiresIn: JwtUtil.options.refreshExpire,
        });
        const tokenSet: TokenSet = {
            access: accessToken,
            refresh: refreshToken,
        }

        return tokenSet;
    }

    /**
     * Access Token 검증
     * @returns (1) ["Valid"   | "Expired",    JwtPayload]
     * @returns (2) ["Invalid" | "Unexpected", undefined]
     */
    public static verifyToken( accessToken: AccessToken ): JwtVerifyResult {
        return JwtUtil.verifyTokenInternal(accessToken)[0];
    }

    /**
     * Access Token 재발급
     * - 만료된 Access Token, 만료되지 않은 Refresh Token 필요
     * @error (1) 토큰이 유효하지 않은 경우
     * @error (2) 리프레시 토큰이 리프레시 토큰이 아님
     * @returns 토큰 문자열
     */
    public static reissueAccessToken( tokenSet: TokenSet ) : AccessToken {

        const [accessVerified, accessDecoded] = JwtUtil.verifyTokenInternal(tokenSet.access);
        const [refreshVerified, ] = JwtUtil.verifyTokenInternal(tokenSet.refresh);

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

            // DB에서 ID-리프레시 토큰 일치 여부 검증
            if(!DbUtil.checkRefreshToken({
                id: decoded.aud,
                refreshToken: tokenSet.refresh,
            })) {
                throw new Error("Invalid Refresh Token");
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