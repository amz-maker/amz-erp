/*------------------------------------------------------------------------------------------------------------------------------------------
 * UseTest.tsx
 * WRITER : 최정근
 * DATE : 2022-10-19
 * DISCRIPTION : 
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import { AmzEnv } from 'module/AmzPack/constant';
import { AmzEnvMode } from 'module/AmzPack/enumeration';

function useTest<T extends string>(moduleName: T) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* ===== State ===== */
  /* ===== Const ===== */
  /* ====== API ====== */
  /* ―――――――――――――――― Method ―――――――――――――――― */
  function makeName(name?: string, number?: number) {
    return `${moduleName}${name !== undefined ? `/${name}` : ''}${number !== undefined ? `/${number}` : ''}`;
  }

  function naming(name?: string, number?: number) {
    if (AmzEnv.mode !== AmzEnvMode.TEST) return {};

    return {
      'data-test-name': makeName(name, number),
    };
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  /* ―――――――――――――――― Return ―――――――――――――――― */
  return { moduleName, naming, makeName };
}

export { useTest };
