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
import { DatePicker, DatePickerProps, Input } from 'antd';

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
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={3}>
        <ERPDesign.Condition title="계약기간">
          <DatePicker onChange={onChange} />
          <em>~</em>
          <DatePicker onChange={onChange} />
        </ERPDesign.Condition>
        <ERPDesign.Condition title="계약사">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition title="프로젝트명"></ERPDesign.Condition>
      </ERPDesign.ConditionArea>
      {/* 컨트롤 버튼 영역 */}
      <ERPDesign.ControlArea>
        <ERPDesign.Submit>조회</ERPDesign.Submit>
        <ERPDesign.Submit>저장</ERPDesign.Submit>
      </ERPDesign.ControlArea>
      {/* 테이블 영역 */}
      <ERPDesign.TableArea>
        <ERPDesign.Table />
      </ERPDesign.TableArea>
    </ERPDesign>
  );
}

namespace SalesCtrctInfoMangnt {}

export default SalesCtrctInfoMangnt;
