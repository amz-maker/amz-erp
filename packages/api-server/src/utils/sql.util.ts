// ===========================================================
//  SQL 유틸리티
// ===========================================================
// - 작성일: 2023. 03. 13.
// - 작성자: 홍사민
// ===========================================================
// [기록]
// ===========================================================
import "dotenv/config";
import { StringUtil } from "./string.util";

export default class SqlUtil {

    /**
     * Where절 쿼리 문자열 동적 생성
     * @param input 입력 오브젝트
     * @param conds Where절 내 정의할 조건 배열
     * @param tabSize 각 조건식 들여쓰기 크기
     * @returns 완성된 Where절 문자열
     * @example
     * ```
     * const queryString = 
       `
       SELECT COL_A AS "colA"
             ,COL_B AS "colB"
             ,COL_C AS "colC"
        FROM TB001
       `
       + 
       SqlUtil.AddWhere(input, [
           ['colA', '>'],
           ['colB', 'LIKE'],
           ['colC', '<', 'No Quot'],
       ]);
     * ```
     */
    public static AddWhere<Input extends Record<string, any>>(
        input: Input, 
        conds: [
            keyof Input & string,     // 컬럼(스네이크)
            '=' | '<' | '>' | 'LIKE', // 연산자
            ('Quot' | 'No Quot')?      // 값에 따옴표 적용 여부
        ][],
        tabSize: number = 6,
    ) {
        const bucket = [] as string[];
        for(const e of conds) {
            const key  = e[0];
            const op   = e[1];
            const quot = e[2]; // 'NUM'으로 값을 준 경우 따옴표 X, 기본값 or 'STR' => 따옴표 O

            const valPart = 
                op === 'LIKE' ? `'%${input[key]}%'` : 
                    (quot === 'No Quot') ? 
                    `${input[key]}` : 
                    `'${input[key]}'`
            ;

            bucket.push(`${' '.repeat(tabSize)}${StringUtil.camelToLargeSnake(key)} ${op} ${valPart}`);
        }
        const strWhere = '\n WHERE \n' + bucket.join('AND \n') + '\n';

        return strWhere;
    }
}