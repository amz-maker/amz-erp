// ===========================================================
//  사용자 로그인
// ===========================================================
// - 작성일: 2023. 03. 09
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import { AccessToken, RefreshToken, TokenSet } from '../../common-types/jwt-auth';
import JwtAuthService from '../../services/jwt-auth.service';

// =================================================================
//  API I/O 정의
// =================================================================
type ApiInput = {
    id: string;
    pwHash: string;
};

type ApiOutput = TokenSet;

// =================================================================
//  쿼리, I/O 정의 (or 서비스 파일 별도 분리)
// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;

// =================================================================
export const userLogin = makeFarestFrame<ApiInput, ApiOutput>(
    'Post', 
    async (input, headers) => 
    {
        const tokens = await JwtAuthService.issueTokens(input);

        await JwtAuthService.updateRefreshToken({
            id: input.id,
            refreshToken: tokens.refresh,
        })

        return wrapApiResponse('MustOne', tokens);
    }, 
);