// ===========================================================
//  인증 관련 타입 정의
// ===========================================================
// - 작성일: 2023. 03. 09.
// - 작성자: 홍사민
// ===========================================================
export type JwtPayload = {
    /**
     * 토큰 종류(Kind)
     */
    knd: 'Access' | 'Refresh';

    /**
     * 토큰 발급자
     */
    iss: string;

    /**
     * 토큰 대상자 (ID)
     */
    aud: string;

    /**
     * 발급일, Unix Time
     */
    iat?: number;

    /**
     * 만료일, Unix Time
     */
    exp?: number;
};

export type JwtToken = string;
export type AccessToken = string;
export type RefreshToken = string;

export type TokenSet = {
    access: AccessToken;
    refresh: RefreshToken;
}

export type JwtVerifyResult = 'Valid' | 'Expired' | 'Invalid' | 'Unexpected';

export type UserAuth = {
    id: string;
    pwHash: string;
};

export type UserRefresh = {
    id: string;
    refreshToken: RefreshToken;
};