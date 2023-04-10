import { StringUtil } from "../utils/string.util";
import "dotenv/config";
import JwtUtil from "../utils/jwt.util";
import JwtAuthService from "../services/jwt-auth.service";
import { pgCurrent } from "../config/db-config";
import PgUtil from "../utils/pg.util";
// import { pgArrayFormat, pgFormat } from "../common/pg-helpers/pg-format";


async function pgInsertTest() {

    const tableName = 'TEST.INSERT_TEST';

    const data: [
        val_int: number,
        val_str: string,
        val_chr: string,
    ][] = [
        [ 1, 'ABC', 'DEF'],
        [ 2, '123111', 'AAAA'],
        [ 3, '01010', 'WWWWW'],
    ];

    // await insertIntoTable({
    //     tableName,
    //     data,
    //     columnNames: ['val_int', 'val_str', 'val_chr']
    // });

    await PgUtil.insertObjectIntoTable({
        tableName,
        data: [
            {
                val_int: 1,
                val_str: 'ABC',
                val_chr: 'DEF',
            },
            {
                val_int: 2,
                val_str: 'WWW',
                val_chr: 'RRR',
            },
        ]
    });
}

const a = () => {
    const strCamel = 'applePeachGrape';
    const strPasca = 'ApplePeachGrape';
    const strKebab = 'apple-peach-grape';

    console.log(StringUtil.camelToKebab (strCamel));
    console.log(StringUtil.camelToPascal(strCamel));
    console.log(StringUtil.pascalToCamel(strPasca));
    console.log(StringUtil.pascalToKebab(strPasca));
    console.log(StringUtil.kebabToCamel (strKebab));
    console.log(StringUtil.kebabToPascal(strKebab));

    console.log(StringUtil.camelToKebab (strCamel) === strKebab);
    console.log(StringUtil.camelToPascal(strCamel) === strPasca);
    console.log(StringUtil.pascalToCamel(strPasca) === strCamel);
    console.log(StringUtil.pascalToKebab(strPasca) === strKebab);
    console.log(StringUtil.kebabToCamel (strKebab) === strCamel);
    console.log(StringUtil.kebabToPascal(strKebab) === strPasca);

};

// const b = async () => {
//     console.log(process.env.JWT_SECRET);

//     const tokens = JwtAuthService.issueTokens({
//         id: 'user123',
//         pwHash: 'qoqoqoqoqoqo',
//     });

//     console.log('Refresh:', JwtUtil.verifyToken(tokens.refresh));
//     console.log('Access:', JwtUtil.verifyToken(tokens.access));

//     const a = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc4MiOiJlY3JlZGl0IiwiYXVkIjoidXNlcjEyMyIsImtuZCI6IlJlZnJlc2giLCJpYXQiOjE2NzgzMjYyNzMsImV4cCI6MTY3ODkzMTA3M30.HXKVT-1IUmtzl132NiRFY2jJkU4mNxCiFUjcgs1ZHWg'
//     console.log('Tempered:', JwtUtil.verifyToken(a));

//     await new Promise((resolve) => { setTimeout(resolve, 3000); });
//     console.log('Timeout:', JwtUtil.verifyToken(tokens.access));

//     const newAccess = JwtUtil.reissueAccessToken(tokens)!;
//     console.log('ReIssue:', newAccess);
//     console.log('ReIssue:', JwtUtil.verifyToken(newAccess));
// };

// b();

( async () => {
    console.log("Test");
    await pgInsertTest();
})();