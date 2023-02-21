import { pgCurrent } from "../../config/db-config";
import { makeFarestController } from '../../common/make-farest';

type ApiInput = {
    value: number;
}

type ApiOutput = {
    first : number;
    second: number;
}

type QueryOutput = ApiOutput;

// =================================================================
export const getUser = makeFarestController<ApiInput, ApiOutput>(
    'Get-query', 
    async (input) => 
{
    const strQuery = 
    `
        SELECT ${input.value} * 100 AS "first"
              ,${input.value} * 200 AS "second"
    `;

    const qr = await pgCurrent.query<QueryOutput>(strQuery);

    return {
        results: qr.rows
    };
});