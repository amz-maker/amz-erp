/*------------------------------------------------------------------------------------------------------------------------------------------
 * UseEffectMounted.tsx
 * WRITER : 최정근
 * DATE : 2022-10-19
 * DISCRIPTION : 
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';

function useEffectMounted(effect: React.EffectCallback, deps?: React.DependencyList | undefined): void {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const isMounted = React.useRef(false);
  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  React.useEffect(() => {
    if (isMounted.current) {
      return effect();
    } else {
      isMounted.current = true;
    }
  }, deps);
  /* ―――――――――――――――― Return ―――――――――――――――― */
  return;
}

export { useEffectMounted };
