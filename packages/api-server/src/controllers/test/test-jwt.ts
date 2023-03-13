// ===========================================================
//  테스트 - JWT 토큰 검증
// ===========================================================
// - 작성일: 2023. 03. 09
// - 작성자: 홍사민
// ===========================================================
import JwtRestService from '../../services/jwt-rest.service';
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";

// =================================================================
type ApiInput = {
    in: number;
};

type ApiOutput = string;

// =================================================================
export const testJwt = makeFarestFrame<ApiInput, ApiOutput>(
    'Post',
    async (input, headers) => 
    {
        await JwtRestService.verifyAccessTokenFromHeader(headers);

        return wrapApiResponse('MustOne', 'Valid Access Token');

    }
);