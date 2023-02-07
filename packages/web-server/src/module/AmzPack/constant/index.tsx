/*------------------------------------------------------------------------------------------------------------------------------------------
 * constant/index.tsx
 * WRITER : 최정근
 * DATE : 2022-10-19
 * DISCRIPTION : const 모음
 * TYPE : Util
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import { AmzEnvMode } from '../enumeration';

export namespace AmzEnv {
  export const mode: AmzEnvMode = Object.values(AmzEnvMode).includes((process.env.REACT_APP_AMZ_MODE ?? '') as any)
    ? (process.env.REACT_APP_AMZ_MODE as AmzEnvMode)
    : AmzEnvMode.UNDEFINED;
}

export namespace AmzConst {}

export namespace AmzMsg {}
