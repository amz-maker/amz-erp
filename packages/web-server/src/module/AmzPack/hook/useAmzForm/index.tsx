/*------------------------------------------------------------------------------------------------------------------------------------------
 * UseAmzForm.tsx
 * WRITER : 최정근
 * DATE : 2022-11-04
 * DISCRIPTION : 
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import lodash from 'lodash';
import { DeepPartial, TypeFlatten } from '../../interface';

interface ISetData<T extends object> {
  <NP extends keyof TypeFlatten<T>, M extends 'OVERRIDE' | 'MERGE' | 'FIND'>(
    mode: M,
    source: M extends 'OVERRIDE' ? T : M extends 'MERGE' ? DeepPartial<T> : M extends 'FIND' ? { namePath: NP; value: TypeFlatten<T>[NP] }[] : any,
  ): void;
}
interface IGetData<T extends object> {
  (): T;
  <NP extends keyof TypeFlatten<T>>(namePath: NP): TypeFlatten<T>[NP] | undefined;
}
interface IClear {
  (): void;
}
interface ISubscribe {
  (namePath: string, update: (v: any) => void): void;
}
interface IUnsubscribe {
  (namePath: string, update: (v: any) => void): void;
}

export type AmzDataType<T extends object = any> = [T, ISetData<T>, IGetData<T>, IClear, ISubscribe, IUnsubscribe];

function useAmzForm<T extends object>(initial: T): AmzDataType<T> {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* ===== State ===== */
  const [data, _setData] = React.useState<T>(initial);
  const [subscribers, setSubscribers] = React.useState<Record<string, ((v: any) => void)[]>>({});
  /* ===== Const ===== */
  /* ====== API ====== */
  /* ―――――――――――――――― Method ―――――――――――――――― */
  function setData<NP extends keyof TypeFlatten<T>, M extends 'OVERRIDE' | 'MERGE' | 'FIND'>(
    mode: M,
    source: M extends 'OVERRIDE' ? T : M extends 'MERGE' ? DeepPartial<T> : M extends 'FIND' ? { namePath: NP; value: TypeFlatten<T>[NP] }[] : any,
  ): void {
    switch (mode) {
      case 'OVERRIDE':
      case 'MERGE':
        const merged = lodash.merge({}, data, source);
        _setData((v) => merged);
        return;
      case 'FIND':
        if (Array.isArray(source)) {
          let tempSource = [...source] as { namePath: string; value: any }[];
          let tempData = { ...data };

          tempSource.forEach((ele) => {
            let keys = ele.namePath.split('.');
            tempData = setDeep(ele.namePath, keys, tempData, ele.value) as T;
          });

          _setData((v) => tempData);
        }
        return;
    }
  }

  function setDeep(namePath: string, keys: string[], obj: object, value: any): object {
    const tempKey = keys.shift();

    if (tempKey === undefined) {
      if (Object.getOwnPropertyDescriptor(subscribers, namePath)) {
        subscribers[namePath].forEach((update) => {
          update(value);
        });
      }
      return (obj = value);
    }

    const desc = Object.getOwnPropertyDescriptor(obj, tempKey);

    if (desc) {
      return (obj = {
        ...obj,
        [tempKey]: setDeep(namePath, keys, !!desc ? desc.value : {}, value),
      });
    } else {
      return obj;
    }
  }

  function getData(): T;
  function getData<NP extends keyof TypeFlatten<T>>(namePath: NP): TypeFlatten<T>[NP] | undefined;
  function getData<NP extends keyof TypeFlatten<T>>(namePath?: NP): T | TypeFlatten<T>[NP] | undefined {
    if (namePath === undefined) {
      return data as any;
    } else {
      const keys = namePath.split('.');
      let tempData = data;

      for (let key of keys) {
        let desc = Object.getOwnPropertyDescriptor(tempData, key);
        if (desc) {
          tempData = desc.value;
        } else {
          return undefined;
        }
      }
      return tempData;
    }
  }

  function clear() {
    _setData((v) => initial);
  }

  function subscribe(namePath: string, update: (v: any) => void) {
    setSubscribers((state) => {
      return {
        ...state,
        [namePath]: [...(namePath in state ? state[namePath] : []), update],
      };
    });
  }
  function unsubscribe(namePath: string, update: (v: any) => void) {
    setSubscribers((state) => {
      return {
        ...state,
        [namePath]: state[namePath].filter((ele) => ele !== update),
      };
    });
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  /* ―――――――――――――――― Return ―――――――――――――――― */
  return [data, setData, getData, clear, subscribe, unsubscribe];
}
export { useAmzForm };
