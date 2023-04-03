// ===========================================================
//  사용자 로그아웃
// ===========================================================
// - 작성일: 2023. 03. 13
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import JwtAuthService from '../../services/jwt-auth.service';
import JwtRestService from '../../services/jwt-rest.service';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {};

type ApiOutput = {
    success: boolean
};

// =================================================================
export const userLogout = makeFarestFrame<ApiInput, ApiOutput>(
    'Post', 
    async (input, headers) => 
    {
        const accessTokenPayload = JwtRestService.verifyAccessTokenFromHeader(headers);

        if(!accessTokenPayload || !accessTokenPayload.aud) {
            throw new Error("Invalid Token Data");
        }

        await JwtAuthService.removeRefreshToken(accessTokenPayload.aud);

        return wrapApiResponse('MustOne', {
            success: true
        });
    }, 
);