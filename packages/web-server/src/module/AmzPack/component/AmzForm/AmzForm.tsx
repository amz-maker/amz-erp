/*------------------------------------------------------------------------------------------------------------------------------------------
 * Form.tsx
 * WRITER : 최정근
 * DATE : 2022-11-04
 * DISCRIPTION : 
 * TYPE : Component
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import { IChildren } from '../../interface';
import formContext from './context';
import { useTest } from 'module/AmzPack/hook/useTest';
import { AmzDataType } from 'module/AmzPack/hook/useAmzForm';

interface FormProps extends IChildren {
  amzData: AmzDataType;
}

function AmzForm(props: FormProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* ===== Props ===== */
  const { amzData, children } = props;
  /* ===== State ===== */

  /* ===== Const ===== */
  const { Provider } = formContext;
  const { naming } = useTest('form');
  /* ====== API ====== */

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <form data-component="form" {...naming()}>
      <Provider value={amzData}>{children}</Provider>
    </form>
  );
}

namespace AmzForm {
  export const context = formContext;
}

export default AmzForm;
