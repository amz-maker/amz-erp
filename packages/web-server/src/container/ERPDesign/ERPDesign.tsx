/*------------------------------------------------------------------------------------------------------------------------------------------
 * ERPDesign.tsx
 * WRITER : 최정근
 * DATE : 2023-02-15
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import { Button } from 'antd';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import React from 'react';
import {
  checkboxColumn,
  Column,
  createTextColumn,
  DataSheetGrid,
  DataSheetGridRef,
  dateColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  percentColumn,
  textColumn,
} from 'react-datasheet-grid';
import { RecoilRoot } from 'recoil';

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
    size: number | string;
  }
  export function ConditionArea(props: ConditionArea) {
    const { size, children } = props;

    function makeTemplate() {
      if (typeof size === 'number') return `repeat(${size}, max-content 1fr)`;
      else {
        let split = size.split(' ');
        let t = '';
        split.map((ele, idx) => {
          t += `max-content ${ele}`;
          if (split.length !== idx + 1) {
            t += ' ';
          }
        });
        return t;
      }
    }

    return (
      <RecoilRoot>
        <DivisionBox data-container="erpDesign.ConditionArea" template={makeTemplate()} verticalAlign={'center'} gap={10}>
          {children}
        </DivisionBox>
      </RecoilRoot>
    );
  }

  interface ConditionProps extends IChildren {
    title: string;
  }
  export function Condition(props: ConditionProps) {
    const { title, children } = props;
    return (
      <>
        <span className="label-box">
          <em>{title}</em>
        </span>
        <DivisionBox className="component-box" template={'max-content'} gap={5} repeat>
          {children}
        </DivisionBox>
      </>
    );
  }

  interface ControlAreaProps extends IChildren {
    onClick?: () => void;
  }
  export function ControlArea(props: ControlAreaProps) {
    const { children } = props;
    return (
      <DivisionBox data-container="erpDesign.controlArea" className="control-area" template={'max-content'} horizonAlign="right" gap={5} repeat>
        {children}
      </DivisionBox>
    );
  }

  interface SubmitProps extends IChildren {
    onClick?: () => void;
  }
  export function Submit(props: SubmitProps) {
    const { children } = props;
    return <Button>{children}</Button>;
  }

  interface TableAreaProps extends IChildren {}
  export function TableArea(props: TableAreaProps) {
    const { children } = props;

    return (
      <DivisionBox data-container="erpDesign.tableArea" className="control-area" template={'100%'} gap={5} repeat>
        {children}
      </DivisionBox>
    );
  }

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
  interface TableProps {}
  export function Table(props: TableProps) {
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
    return <DataSheetGrid ref={ref} value={data} onChange={setData} columns={columns}></DataSheetGrid>;
  }
}

export default ERPDesign;
