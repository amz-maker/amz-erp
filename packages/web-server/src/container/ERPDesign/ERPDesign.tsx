/*------------------------------------------------------------------------------------------------------------------------------------------
 * ERPDesign.tsx
 * WRITER : 최정근
 * DATE : 2023-02-15
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import React from 'react';

interface ERPDesignProps extends IChildren, IDataPage {}
function ERPDesign(props: ERPDesignProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { 'data-page': dataPage, children } = props;

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <div data-page={dataPage} data-container="erpDesign">
      {children}
    </div>
  );
}

namespace ERPDesign {
  interface ConditionArea extends IChildren {
    size: number;
  }
  export function ConditionArea(props: ConditionArea) {
    const { size, children } = props;
    return (
      <DivisionBox data-container="erpDesign.ConditionArea" template={`repeat(${size}, max-content 1fr)`} gap={5}>
        {children}
      </DivisionBox>
    );
  }
}

export default ERPDesign;
