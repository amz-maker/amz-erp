import React from 'react';

export function useToggle<몰루>(defaultState: boolean = false, values?: 몰루): [boolean, () => void] {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* ===== State ===== */
  const [toggle, setToggle] = React.useState<boolean>(defaultState);

  /* ===== Const ===== */
  /* ====== API ====== */
  /* ―――――――――――――――― Method ―――――――――――――――― */
  function change() {
    setToggle(!toggle);
  }
  /* ―――――――――――――― Use Effect ―――――――――――――― */
  /* ―――――――――――――――― Return ―――――――――――――――― */
  return [toggle, change];
}
