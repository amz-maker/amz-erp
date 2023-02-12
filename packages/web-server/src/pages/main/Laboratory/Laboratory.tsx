/*------------------------------------------------------------------------------------------------------------------------------------------
 * Laboratory.tsx
 * WRITER : 최정근
 * DATE : 2023-02-08
 * DISCRIPTION : 
 * TYPE : Page
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import {
  Column,
  DataSheetGrid,
  DataSheetGridRef,
  checkboxColumn,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  textColumn,
  createTextColumn,
  percentColumn,
} from 'react-datasheet-grid';

import { DivisionBox } from 'module/AmzPack/component';
import { IChildren } from 'module/AmzPack/interface';

interface LaboratoryProps {}

function Laboratory(props: LaboratoryProps) {
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
    <div data-page="laboratory">
      <Lab01 />
    </div>
  );
}

/* Lab-01 */
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

interface Lab01 {}
function Lab01(props: Lab01) {
  const [data, setData] = React.useState<Row[]>([
    { checkbox: true, text: 'text 1', int: 1, float: 1.0, date: new Date(), isoDate: '2022-01-01', percent: 0.1, custom: '커스텀(이메일)' },
    { checkbox: false, text: 'text 2', int: 2, float: 2.0, date: new Date(), isoDate: '2022-01-01', percent: 0.2, custom: null },
  ]);

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

  const ref = React.useRef<DataSheetGridRef>(null);

  React.useEffect(() => {}, []);

  return (
    <Laboratory.Lab title="Vanilla Datasheet">
      <DataSheetGrid ref={ref} value={data} onChange={setData} columns={columns}></DataSheetGrid>
    </Laboratory.Lab>
  );
}

namespace Laboratory {
  interface LabProps extends IChildren {
    title: string;
    render?: boolean;
  }
  export function Lab(props: LabProps) {
    const { title, render = true, children } = props;
    return render ? (
      <div data-container="laboratory.lab">
        <DivisionBox className="title-area" verticalAlign={'center'}>
          <em>{title}</em>
        </DivisionBox>
        <div className="contents-area">{children}</div>
      </div>
    ) : (
      <></>
    );
  }
}

export default Laboratory;
