// ===========================================================
//  라우팅 노드 재귀 확장 실행부
// ===========================================================
// - 작성일: 2023. 02. 22
// - 작성자: 홍사민
// ===========================================================
import { routeTree } from "./route-tree";

(() => {

    function goDeepRecursive(curName: string, node: Object) {

        if(node === undefined) return;
        if(typeof node !== typeof {}) return;
        
        (node as any)['n'] = `/${curName}`;

        const keys = Object.keys(node);
        for(const i of keys) {
            const nextName = `${curName}/${i}`;
            goDeepRecursive(nextName, (node as any)[i]);
        }
    }
    
    function extendRouteTree(node: object) {
        const keys = Object.keys(node);
        
        for(const i of keys) {
            goDeepRecursive(i, (node as any)[i])
        }
    }

    extendRouteTree(routeTree);
})();

export function extractRouteNode(node: Object): string {
    if('n' in node) return (node as any)['n'];

    throw new Error(`Route Node Extraction ERROR : ${node}`)
}