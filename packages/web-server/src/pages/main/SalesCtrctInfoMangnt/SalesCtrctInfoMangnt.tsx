/*------------------------------------------------------------------------------------------------------------------------------------------
 * SalesCtrctInfoMangnt.tsx
 * WRITER : 최정근
 * DATE : 2023-02-14
 * DISCRIPTION : 
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import ERPDesign from 'container/ERPDesign';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';

interface SalesCtrctInfoMangntProps {}

function SalesCtrctInfoMangnt(props: SalesCtrctInfoMangntProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* Props ――――― */
  const {} = props;
  /* State ――――― */
  /* Const ――――― */
  /* API ――――――― */

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="salesCtrctInfoMangnt">
      <ERPDesign.ConditionArea size={4}>
        <em>계약기간</em>
        <em>발주사</em>
        <em>계약사</em>
        <em>프로젝트명</em>
      </ERPDesign.ConditionArea>
    </ERPDesign>
  );
}

namespace SalesCtrctInfoMangnt {}

export default SalesCtrctInfoMangnt;
