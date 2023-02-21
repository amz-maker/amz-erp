import { makeQueryService } from "../../common/make-query-service";

type QueryInput = {
    in1: number;
    in2: string;
};

type QueryOutput = {
    out1: number;
    out2: number;
    out3: string;
};

const queryServiceName = makeQueryService<
    QueryInput, 
    QueryOutput
>(
    'One',
    `
    SELECT 
        {in1}      AS "out1",
        {in1} * 20 AS "out2",
        {in2}      AS "out3"
    `
);