namespace Util {
  export namespace is {
    export function string(data: any): data is string {
      return typeof data === 'string';
    }
    export function number(data: any): data is number {
      return typeof data === 'number';
    }
    export function func(data: any): data is Function {
      return typeof data === 'function';
    }
    export function object(data: any): data is object {
      return typeof data === 'object';
    }
    export function array(data: any): data is any[] {
      return Array.isArray(data);
    }
    export function empty(data: Array<any>): boolean {
      return !data.length;
    }
    export function undefData(data: any): data is undefined {
      return data === undefined;
    }
    export function nullData(data: any): data is null {
      return data === null;
    }
    export function undefOrNull(data: any): data is undefined | null {
      return data === undefined || data === null;
    }
  }
  /* ==========
   * Check
   * ========== */
  export namespace check {
    // Or 여러개 한번에 체크
    export function or<T, R extends T>(target: T, list: R[]): boolean;
    export function or<T, R extends T, YES, NO>(target: T, list: R[], yes: YES, no: NO): YES | NO;
    export function or<T, R extends T, YES, NO>(target: T, list: R[], yes?: YES, no?: NO): YES | NO | boolean {
      let res: boolean = false;

      for (let ele of list) {
        if (target === ele) {
          res = true;
          break;
        }
      }

      if (res === true && yes !== undefined) return yes;
      else if (res === false && no !== undefined) return no;
      else return res;
    }

    // And 여러개 한번에 체크
    export function and<T, R extends T>(target: T, list: R[]): boolean;
    export function and<T, R extends T, YES, NO>(target: T, list: R[], yes: YES, no: NO): YES | NO;
    export function and<T, R extends T, YES, NO>(target: T, list: R[], yes?: YES, no?: NO): YES | NO | boolean {
      let res: boolean = true;

      for (let ele of list) {
        if (target !== ele) {
          res = false;
          break;
        }
      }

      if (res === true && yes !== undefined) return yes;
      else if (res === false && no !== undefined) return no;
      else return res;
    }
  }
  export namespace props {
    export function data(attr: { dataLayout?: string; dataPage?: string; dataContainer?: string; dataComponent?: string }) {
      return {
        ...(!!attr.dataLayout && { 'data-layout': attr.dataLayout }),
        ...(!!attr.dataPage && { 'data-page': attr.dataPage }),
        ...(!!attr.dataContainer && { 'data-container': attr.dataContainer }),
        ...(!!attr.dataComponent && { 'data-component': attr.dataComponent }),
      };
    }
  }
  export namespace enums {
    export function getKeys<T>(e: Record<string, string | number>): string[] {
      return Object.keys(e).filter((v) => isNaN(Number(v))) as string[];
    }
    // export function getValues<T extends Record<string, string | number> = Record<string, string | number>>(e: T): T {
    //   return Object.values(e).filter((v) => !isNaN(Number(v)));
    // }
    export function getValues<T>(e: Record<string, string | number>): T[] {
      return Object.values(e).filter((v) => !isNaN(Number(v))) as T[];
    }

    export function map<T = any>(e: Record<string, string | number>, func: (key: string, value: string | number, idx: number) => T): T[] {
      const keys = enums.getKeys(e);
      return keys.map((key, idx) => func(key, e[key], idx));
    }

    export function foreach(e: Record<string, string | number>, func: (key: string, value: string | number, idx: number) => void): void {
      const keys = enums.getKeys(e);
      keys.map((key, idx) => func(key, e[key], idx));
    }
  }
}

export default Util;
