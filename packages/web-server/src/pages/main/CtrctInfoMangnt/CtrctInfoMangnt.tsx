/*------------------------------------------------------------------------------------------------------------------------------------------
 * CtrctInfoMangnt.tsx
 * WRITER : 박진실
 * DATE : 2023-03-29
 * DISCRIPTION : 계약 정보 관리
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import ERPDesign from 'container/ERPDesign';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import { DatePicker, DatePickerProps, FormInstance, Input } from 'antd';

interface CtrctInfoMangntProps {}

function CtrctInfoMangnt (props: CtrctInfoMangntProps) { 
  /* ――――――――――――――― Variable ――――――――――――――― */
  /* Props ――――― */
  const {} = props;
  /* State ――――― */
  /* Const ――――― */
  const formRef = React.useRef<FormInstance>(null);
  const erpDesing = ERPDesign.useERPDesign(
    (values) => {
      console.log('[Values]', values);
    },
    () => {},
  );
  /* API ――――――― */

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="salesCtrctInfoMangnt" {...erpDesing} formref={formRef}>
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={'1fr 2fr 2fr 1fr'}>
        <ERPDesign.Condition label="계약기간" name="a">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약사" name="b">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="프로젝트명" name="c">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="달력" name="vvvv">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
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
};

namespace CtrctInfoMangnt {};

export default CtrctInfoMangnt;
