// ===========================================================
//  PostgreSQL 쿼리 유틸리티
// ===========================================================
// - 작성일: 2023. 04. 10.
// - 작성자: 홍사민
// ===========================================================
/* 
[발생 가능한 에러]
1. Error: Your application tried to access utils, but it isn't declared in your dependencies; this makes the require call ambiguous and unsound.
  - 해결 방법: 
    - 만약 상단의 import 구문이 `import PgUtil from "utils/pg.util";` 처럼 되어 있다면, `"../utils/pg.util";`와 같이 상대 경로 참조로 변경
*/
/* 
[사용 예제]

// 1. insertIntoTable(이중 배열 형태)
await PgUtil.insertIntoTable({
    tableName: 'TABLE_NAME',
    data: [                        // 이중 배열 형태의 행 데이터
        [ 1, 'ABC', 'DEF'],
        [ 2, '121', 'AAAA'],
        [ 3, '010', 'WWWWW'],
    ],
    // columnNames: ['val_int', 'val_str', 'val_chr']    // 컬럼명 명시하려면 사용
});

// 2. insertObjectIntoTable(오브젝트 배열 형태)
await PgUtil.insertObjectIntoTable({
    tableName: 'TABLE_NAME',
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

// 3. insertObjectIntoTable(오브젝트 형태)
await PgUtil.insertObjectIntoTable({
    tableName: 'TABLE_NAME',
    data: {
        val_int: 1,
        val_str: 'ABC',
        val_chr: 'DEF',
    }
});

*/
// ===========================================================
import { pgCurrent } from "../config/db-config";
import { StringUtil } from "./string.util";

export default class PgUtil {

    /**
     * 이중 배열 형태의 데이터를 테이블에 삽입
     * - tableName: 테이블명
     * - (Optional)coumnNames: 컬럼명 배열(순서는 데이터와 일치)
     * - data: 이중 배열 형태의 행 데이터
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async insertIntoTable(args: {
        tableName: string, 
        columnNames?: string[],
        data: any[][]
    })
    {
        const data = args.data;

        if(data === undefined || data === null || data.length === 0) {
            
            console.log('\n===================== WARNING: insertIntoTable() =====================');
            console.log(` - Argument 'data' is empty or null`);
            console.log(data);
            return 0;
        }

        const tableName = args.tableName;
        // const coulmnNames = args.columnNames ? 
        //     ` ( ${args.columnNames.join(', ')} )` 
        // : '';

        const coulmnNames = args.columnNames ? ' ('+args.columnNames.map((item, index) => `${StringUtil.camelToLargeSnake(item)}`).join(', ')+')' : '';

        const conlumnQuesMarks = data[0].map((d, i) => (
            `\$${i + 1}`
        )).join(', ');

        try {
            await pgCurrent.query('BEGIN');
            let resultCount = 0;

            for(const elm of data) {
                const query = `INSERT INTO ${tableName}${coulmnNames} VALUES (${conlumnQuesMarks})`;
                console.log(query);
                const qr = await pgCurrent.query(query, elm);
                resultCount += qr.rowCount
            }
            
            await pgCurrent.query('COMMIT');
            return resultCount;
        } catch(err) {
            await pgCurrent.query('ROLLBACK');
            console.log('\n===================== ERROR: insertIntoTable() =====================');
            console.log(err);
            return 0;
        }
    }

    /**
     * 오브젝트 또는 오브젝트 배열 형태의 데이터를 테이블에 삽입
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async insertObjectIntoTable<T extends Record<string, any>>(args: {
        tableName: string, 
        data: T[] | T
    }) {
        const data = (Array.isArray(args.data) ? args.data : [args.data]) as any as T[];
        if(data.length == 0){
            return 0;
        }

        const columnNames = Object.keys(data[0]);
        const rows = data.map((v) => (Object.values(v)));

        return await this.insertIntoTable({
            tableName: args.tableName,
            columnNames,
            data: rows,
        });
    }



    
    /**
     * 이중 배열 형태의 데이터를 테이블에 업데이트
     * - tableName: 테이블명
     * - coumnNames: 컬럼명 배열(순서는 데이터와 일치)
     * - data: 이중 배열 형태의 행 데이터
     * - pkNames: PK명 배열
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async updateSetTable(args: {
        tableName: string, 
        columnNames: string[],
        data: any[][],
        pkNames: string[]
    })
    {
        const data = args.data;

        if(data === undefined || data === null || data.length === 0) {
            
            console.log('\n===================== WARNING: updateSetTable() =====================');
            console.log(` - Argument 'data' is empty or null`);
            console.log(data);
            return 0;
        }

        const tableName = args.tableName;

        for(let i = 0; i < args.pkNames.length; i++)
        {
            args.pkNames[i] = StringUtil.snakeToCamel(args.pkNames[i]);
        }

        const columnNames = args.columnNames.map((item, index) => `${StringUtil.camelToLargeSnake(item)} = \$${index+1}`).join(', ');

        const keyNames = args.columnNames.map((item, index) => (args.pkNames.indexOf(item) > -1 ? `${StringUtil.camelToLargeSnake(item)} = \$${index+1}` : null)).filter((v) => v !== null).join(' AND ');

        try {
            await pgCurrent.query('BEGIN');
            let resultCount = 0;

            for(const elm of data) {
                const query = `UPDATE ${tableName} SET ${columnNames} WHERE ${keyNames}`;
                // console.log(query);
                // console.log(elm);
                const qr = await pgCurrent.query(query, elm);
                resultCount += qr.rowCount;
            }
            
            await pgCurrent.query('COMMIT');
            return resultCount;
        } catch(err) {
            await pgCurrent.query('ROLLBACK');
            console.log('\n===================== ERROR: updateSetTable() =====================');
            console.log(err);
            return 0;
        }
    }

    /**
     * 오브젝트 또는 오브젝트 배열 형태의 데이터를 테이블에 업데이트
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async updateObjectSetTable<T extends Record<string, any>>(args: {
        tableName: string, 
        pkNames: string[],
        data: T[] | T
    }) {
        const data = (Array.isArray(args.data) ? args.data : [args.data]) as any as T[];
        if(data.length == 0){
            return 0;
        }

        const columnNames = Object.keys(data[0]);
        const rows = data.map((v) => (Object.values(v)));

        return await this.updateSetTable({
            tableName: args.tableName,
            columnNames: columnNames,
            pkNames: args.pkNames,
            data: rows,
        });
    }



    
    /**
     * 이중 배열 형태의 데이터를 테이블에 업데이트
     * - tableName: 테이블명
     * - coumnNames: 컬럼명 배열(순서는 데이터와 일치)
     * - data: 이중 배열 형태의 행 데이터
     * - pkNames: PK명 배열
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async deleteFromTable(args: {
        tableName: string, 
        columnNames: string[],
        data: any[][],
        pkNames: string[]
    })
    {
        const data = args.data;

        if(data === undefined || data === null || data.length === 0) {
            
            console.log('\n===================== WARNING: deleteFromTable() =====================');
            console.log(` - Argument 'data' is empty or null`);
            console.log(data);
            return 0;
        }

        const tableName = args.tableName;

        for(let i = 0; i < args.pkNames.length; i++)
        {
            args.pkNames[i] = StringUtil.snakeToCamel(args.pkNames[i]);
        }

        const columnNames = args.columnNames.map((item, index) => `${StringUtil.camelToLargeSnake(item)} = \$${index+1}`).join(', ');


        // pk1 = $1 AND pk2 = $2 AND pk3 = $3 의 형태
        let keyIndex = 1;
        const keyNames = args.columnNames.map((item) => (args.pkNames.indexOf(item) > -1 ? `${StringUtil.camelToLargeSnake(item)} = \$${keyIndex++}` : null)).filter((v) => v !== null).join(' AND ');


        // [pk1,pk2,null,null,pk3] 의 형태로 변경
        // elm에서 필터의 역할을 하게 될 예정
        const keyValues = args.columnNames.map((item) => (args.pkNames.indexOf(item) > -1 ? item : null));

        try {
            await pgCurrent.query('BEGIN');
            let resultCount = 0;

            for(const elm of data) {
                const keyData = elm.map((item, index) => (keyValues[index] !== null ? item : null)).filter((v) => v !== null);
                const query = `DELETE FROM ${tableName} WHERE ${keyNames}`;
                // console.log(query);
                // console.log(keyData);
                const qr = await pgCurrent.query(query, keyData);
                resultCount += qr.rowCount;
            }
            
            await pgCurrent.query('COMMIT');
            return resultCount;
        } catch(err) {
            await pgCurrent.query('ROLLBACK');
            console.log('\n===================== ERROR: deleteFromTable() =====================');
            console.log(err);
            return 0;
        }
    }

    /**
     * 오브젝트 또는 오브젝트 배열 형태의 데이터를 테이블에 업데이트
     * 
     * (예제는 pg.utils.ts 스크립트 상단 주석 참조)
     */
    public static async deleteObjectFromTable<T extends Record<string, any>>(args: {
        tableName: string, 
        pkNames: string[],
        data: T[] | T
    }) {
        const data = (Array.isArray(args.data) ? args.data : [args.data]) as any as T[];
        if(data.length == 0){
            return 0;
        }

        const columnNames = Object.keys(data[0]);
        const rows = data.map((v) => (Object.values(v)));

        return await this.deleteFromTable({
            tableName: args.tableName,
            columnNames: columnNames,
            pkNames: args.pkNames,
            data: rows,
        });
    }
}

