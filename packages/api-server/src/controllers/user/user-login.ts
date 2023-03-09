// ===========================================================
//  사용자 로그인
// ===========================================================
// - 작성일: 2023. 03. 09
// - 작성자: 홍사민
// ===========================================================
import { makeFarestFrame } from '../../common/make-farest';
import { wrapApiResponse, wrapErrorResponse } from "../../common/wrap-api-response";
import JwtUtil from '../../utils/jwt-util';
import { AccessToken, RefreshToken, TokenSet } from '../../common-types/jwt-auth';

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
        // console.log(input);

        // TODO: DB의 유저 테이블에 리프레시 토큰 저장

        try {
            const tokens = JwtUtil.issueTokens(input);
            return wrapApiResponse('MustOne', tokens);
        }
        catch {
            return wrapErrorResponse('Invalid User');
        }
    }, 
);