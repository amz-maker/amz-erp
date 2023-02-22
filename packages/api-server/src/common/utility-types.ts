// ===========================================================
//  각종 유틸리티 타입 정의
// ===========================================================
// - 작성일: 2023. 02. 21
// - 작성자: 홍사민
// ===========================================================

// =============================
//  Unions
// =============================
export type ArrayToUnion<T extends any[]> = T[number];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
  ) => void
    ? I
    : never;
  
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;
type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
: [T, ...A]; // 

// =============================
//  Mapped
// =============================
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type KeysWithout<T, F> = {
    [K in keyof T]: T[K] extends F ? never : K;
}[keyof T];

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};

// =============================
//  String
// =============================
export type Concat<T extends string[]> = T extends [
    infer F,
    ...infer R
]
? F extends string
    ? R extends string[]
        ? `${F}${Concat<R>}`
        : never
    : never
: ''
;

type JoinInternal<T extends string[], D extends string> = T extends [
        infer F,
        ...infer R
    ]
    ? F extends string
        ? R extends string[]
            ? `${F}${D}${JoinInternal<R, D>}`
            : never
        : never
    : ''
;
export type Join<T extends string[], D extends string> = JoinInternal<T, D> extends `${infer A}${D}` ? `${A}` : '';

// `"컬럼1", "컬럼2"` 꼴 제네릭 생성
type GenColumnStmtsInternal<TArr extends string[], TOut extends string[]> = 
    TArr['length'] extends 0 ? 
        TOut : TArr extends [infer StringElement, ...infer Tails] ? 
            StringElement extends string ? Tails extends string[] ? 
                GenColumnStmtsInternal<Tails, [...TOut, `${string}"${StringElement}"${string}`]> // 스트링 요소 편집하는 부분(수정 필요)
    : never : never : TOut
;
export type GenColumnStmts<TArr extends string[]> = GenColumnStmtsInternal<TArr, []>;

// =============================
//  Object, Array
// =============================
export type MinusOne<T extends number> = 
T extends 1 ? 0 :
T extends 2 ? 1 :
T extends 3 ? 2 :
T extends 4 ? 3 :
T extends 5 ? 4 :
T extends 6 ? 5 :
T extends 7 ? 6 :
T extends 8 ? 7 :
T extends 9 ? 8 :
T extends 10 ? 9 : 
never;

export type LastIndexOf<TArr>     = TArr extends any[] ? MinusOne<TArr['length']> : never;
export type FirstElementOf<TArr>  = TArr extends [infer H, ...any] ? H : never;
export type FirstElementOf2<TArr> = TArr extends any[] ? TArr[0] : never;
export type LastElementOf<TArr>   = TArr extends [unknown, ...any, infer Z] ? Z : never;
export type LastElementOf2<TArr>  = TArr extends any[] ? TArr[LastIndexOf<TArr>] : never;

export type HeadOf<TArr>          = TArr extends [...infer U, unknown] ? U : [];
export type TailOf<TArr>          = TArr extends [unknown, ...infer U] ? U : [];

export type LengthOf<TArr>        = TArr extends any[] ? TArr['length'] : never;

export type HasOneElement<TArr>   = TArr extends [unknown] ? true : false; // 하나의 원소만 갖고 있는 배열
export type IsNotEmpty<TArr>      = TArr extends [unknown] ? true : TArr extends [unknown, ...any] ? true : false;
export type IsEmpty<TArr>         = TArr extends [unknown] ? false : TArr extends [unknown, ...any] ? false : true;

export type ArrayOfKeys<TObj>       = UnionToArray<keyof TObj>;
export type FirstKeyOf<TObj>        = FirstElementOf<ArrayOfKeys<TObj>>;
export type LastKeyOf<TObj>         = LastElementOf<ArrayOfKeys<TObj>>;
export type OmitFirstKey<TObj>      = Omit<TObj, FirstKeyOf<TObj>>;
export type HasKey<TObj>            = keyof TObj extends never ? false : true;
/*
// 예제
type lastIndexofArray     = LastIndexOf<['1', '2', '3']>;     // 2
type firstElementOfArray  = FirstElementOf<['1', '2', '3']>;  // '1'
type firstElementOfArray2 = FirstElementOf2<['1', '2', '3']>; // '1'
type lastElementOfArray   = LastElementOf<['1', '2', '3']>;   // '3'
type lastElementOfArray2  = LastElementOf2<['1', '2', '3']>;  // '3'

type headOfArray          = HeadOf<['1', '2', '3']>; // ['1', '2']
type tailOfArray          = TailOf<['1', '2', '3']>; // ['2', '3']
type lengthOfArray        = LengthOf<['1', '2', '3']> // 3;

type arrayHasOneElement1  = HasOneElement<['1', '2']>; // false
type arrayHasOneElement2  = HasOneElement<['1']>;      // true
type arrayHasOneElement3  = HasOneElement<[]>;         // false

type arrayIsNotEmpty1     = IsNotEmpty<['1', '2', '3']>; // true
type arrayIsNotEmpty2     = IsNotEmpty<[]>;              // false
type arrayIsEmpty1        = IsEmpty<['1', '2', '3']>;    // false
type arrayIsEmpty2        = IsEmpty<[]>;                 // true

type arrayOfKeysOfObject  = ArrayOfKeys<{ a: number, b: string, c: boolean }>;  // ['a', 'b', 'c']
type firstKeyOfObject     = FirstKeyOf<{ a: number, b: string, c: boolean }>;   // 'a'
type lastKeyOfObject      = LastKeyOf<{ a: number, b: string, c: boolean }>;    // 'c'
type omitFirstKeyOfObject = OmitFirstKey<{ a: number, b: string, c: boolean }>; // { b: string, c: boolean }
type objectHasKey1        = HasKey<{ a: number, b: string, c: boolean }>;       // true
type objectHasKey2        = HasKey<{}>; // false
*/