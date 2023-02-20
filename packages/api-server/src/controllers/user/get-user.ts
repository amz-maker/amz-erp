import { pgCurrent } from "../../config/db-config";
import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
import { Pool } from "pg";
import { GenFarestBody, makeFarestController } from '../../common/make-farest';

// GET 입력: 파라미터(/)
type Input = {
    value: number;
}

// DB 쿼리 출력
type QueryReturn =  {
    first : number;
    second: number;
}

// GET 출력
type Output = QueryReturn;

// =================================================================
export const getUser = makeFarestController<Input, Output>(
    'Get-query', 
    async (input) => 
{
    const strQuery = 
    `
        SELECT ${input.value} * 100 AS "first"
              ,${input.value} * 200 AS "second"
    `;

    const qr = await pgCurrent.query<QueryReturn>(strQuery);

    return {
        result: qr.rows
    };

    // return {
    //     result: [{
    //         first: input.value * 2,
    //         second: input.value * 4,
    //     }]
    // };
});