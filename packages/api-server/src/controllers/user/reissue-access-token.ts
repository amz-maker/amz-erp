// ===========================================================
//  액세스 토큰 재발급
// ===========================================================
// - 작성일: 2023. 03. 09
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import { AccessToken, RefreshToken, TokenSet } from '../../common-types/jwt-auth';
import JwtRestService from '../../services/jwt-rest.service';

export const reissueAccessToken = makeFarestFrame<{}, AccessToken>(
    'Post', 
    async (input, headers) => 
    {
        return wrapApiResponse('MustOne', await JwtRestService.reissueAccessTokenFromHeader(headers));
    }, 
);