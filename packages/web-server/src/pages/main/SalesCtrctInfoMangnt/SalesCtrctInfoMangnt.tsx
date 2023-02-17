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
import { DatePicker, DatePickerProps } from 'antd';

interface SalesCtrctInfoMangntProps {}

function SalesCtrctInfoMangnt(props: SalesCtrctInfoMangntProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* Props ――――― */
  const {} = props;
  /* State ――――― */
  /* Const ――――― */
  /* API ――――――― */

  /* ―――――――――――――――― Method ―――――――――――――――― */
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    // 와
  };

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="salesCtrctInfoMangnt">
      <ERPDesign.ConditionArea size={'1fr 1fr 1fr 1fr'}>
        <ERPDesign.Condition title="계약기간">
          <DatePicker onChange={onChange} />
        </ERPDesign.Condition>
        <ERPDesign.Condition title="계약사"></ERPDesign.Condition>
        <ERPDesign.Condition title="프로젝트명"></ERPDesign.Condition>
      </ERPDesign.ConditionArea>
    </ERPDesign>
  );
}

namespace SalesCtrctInfoMangnt {}

export default SalesCtrctInfoMangnt;
