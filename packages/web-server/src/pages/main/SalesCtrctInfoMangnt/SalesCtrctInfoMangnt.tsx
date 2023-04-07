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
import { DatePicker, DatePickerProps, FormInstance, Input } from 'antd';
import {
  checkboxColumn,
  Column,
  createTextColumn,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  percentColumn,
  textColumn,
} from 'react-datasheet-grid';

interface SalesCtrctInfoMangntProps {}

type Row = {
  checkbox: boolean;
  text: string | null;
  int: number | null;
  float: number | null;
  date: Date | null;
  isoDate: string | null;
  percent: number | null;
  custom: string | null;
};

function SalesCtrctInfoMangnt(props: SalesCtrctInfoMangntProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;
  const erpDesing = ERPDesign.useERPDesign(
    (values) => {
      console.log('[Values]', values);
    },
    () => {},
  );

  const formRef = React.useRef<FormInstance>(null);
  const [rowData, setRowData] = React.useState<Row[]>([]);

  // 사용자 지정 Colum
  const emailColum = createTextColumn<string | null>({
    placeholder: '이메일을 입력해 주세요',

    // alignRight: true
  });

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'checkbox'>('checkbox', checkboxColumn),
      title: '체크박스',
      grow: 1,
      minWidth: 50, // 최소 width
      maxWidth: 100, // 최대 width
    },
    {
      ...keyColumn<Row, 'text'>('text', textColumn),
      title: '텍스트',
      grow: 2, // 넓이 증가 비율 (Default: 1), "grow: 0" -> 증가율 0
    },
    {
      ...keyColumn<Row, 'int'>('int', intColumn),
      title: '정수',
    },
    {
      ...keyColumn<Row, 'float'>('float', floatColumn),
      title: '실수',
    },
    {
      ...keyColumn<Row, 'date'>('date', dateColumn),
      title: '날짜',
    },
    {
      ...keyColumn<Row, 'isoDate'>('isoDate', isoDateColumn),
      title: 'ISO 날짜',
    },
    {
      ...keyColumn<Row, 'percent'>('percent', percentColumn),
      title: '퍼센트',
    },
    {
      ...keyColumn<Row, 'custom'>('custom', emailColum),
      title: '커스텀',
    },
  ];

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  React.useEffect(() => {
    // Row Data 설정
    setRowData([
      { checkbox: true, text: 'text 1', int: 1, float: 1.0, date: new Date(), isoDate: '2022-01-01', percent: 0.1, custom: '커스텀(이메일)' },
      { checkbox: false, text: 'text 2', int: 2, float: 2.0, date: new Date(), isoDate: '2022-01-01', percent: 0.2, custom: null },
    ]);
  }, []);

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <ERPDesign data-page="salesCtrctInfoMangnt" {...erpDesing} formRef={formRef}>
      {/* 조회조건 영역 */}
      <ERPDesign.ConditionArea size={3}>
        <ERPDesign.Condition label="계약기간" name="a">
          <DatePicker.RangePicker />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="계약사" name="b">
          <Input />
        </ERPDesign.Condition>
        <ERPDesign.Condition label="프로젝트명" name="c"></ERPDesign.Condition>
      </ERPDesign.ConditionArea>
      {/* 컨트롤 버튼 영역 */}
      <ERPDesign.ControlArea>
        <ERPDesign.Submit>조회</ERPDesign.Submit>
        <ERPDesign.Submit>저장</ERPDesign.Submit>
      </ERPDesign.ControlArea>
      {/* 테이블 영역 */}
      <ERPDesign.TableArea>
        <ERPDesign.Table
          columns={columns}
          data={{
            row: rowData,
            set: setRowData,
          }}
        />
      </ERPDesign.TableArea>
    </ERPDesign>
  );
}

namespace SalesCtrctInfoMangnt {}

export default SalesCtrctInfoMangnt;
