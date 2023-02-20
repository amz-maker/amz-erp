import { FastifyInstance, FastifyRequest, FastifyReply, RouteGenericInterface, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression } from "fastify";
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
export const controllerName = makeFarestController<Input, Output>(
    'Get-query', 
    // async () => 
    async (input) => 
{

    // const qr = {} as any;

    return {
        result: [{
            first: 1232,
            second: 2324
        }]
    };
});

/*
const controllerBody: GenFarestBody<Input, Output> = async () => {

    // const qr = {} as any;

    return {
        result: [{
            first: 1232,
            second: 2324
        }]
    };
}

export const controllerName = makeFarestController<Input, Output>('Get-query', controllerBody);
*/