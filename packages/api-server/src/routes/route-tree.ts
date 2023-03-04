// ===========================================================
//  [ // TODO ] 라우팅 트리 정의
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
export type RouteNode = Object;
export const routeTree = {
    accnt: {},
    ctrct: {},
    mnpr: {},
    pchs: {},
    sales: {},
    send: {},
    sttstc: {},
    user: {
        find: {},
        search: {},
        login: {},
        modify: {},
        complex: {},
    },
} as const;

