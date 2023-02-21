import { makeFarestController } from '../../common/make-farest';
import { makeQueryService, wrapQueryReturnToApiResponse } from "../../common/make-query-service";

type ApiInput = {
    value: number;
}

type ApiOutput = {
    id : number;
    name: number;
}

// =================================================================
type QueryInput = ApiInput;
type QueryOutput = ApiOutput;

const queryService = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'Many',
    `
        SELECT {value} AS "id",
            200 AS "name"
    `
);

// =================================================================
export const getUser2 = makeFarestController<ApiInput, ApiOutput>(
    'Get-query', 
    async (input) => 
{
    const qr = await queryService(input);

    return wrapQueryReturnToApiResponse('Many', qr);
});