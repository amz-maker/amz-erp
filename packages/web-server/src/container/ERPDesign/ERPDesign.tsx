/*------------------------------------------------------------------------------------------------------------------------------------------
 * ERPDesign.tsx
 * WRITER : 최정근
 * DATE : 2023-02-15
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import { Button, Form } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IChildrenElement, IDataPage } from 'module/AmzPack/interface';
import { useERPDesign as _useERPDesign } from './hook/useERPDesign';

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
import { NamePath } from 'antd/es/form/interface';

interface ERPDesignProps<T extends object> extends IChildren, IDataPage {
  onFinish?: ((values: T) => void) | undefined;
  onFinishFailed?: ((errorInfo: any) => void) | undefined;
  formRef: React.RefObject<FormInstance<any>>;
}
function ERPDesign<T extends object>(props: ERPDesignProps<T>) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { 'data-page': dataPage, formRef, children } = props;

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <RecoilRoot>
      <Form {...props} ref={formRef}>
        <div data-page={dataPage} data-container="erpDesign">
          {children}
        </div>
      </Form>
    </RecoilRoot>
  );
}

namespace ERPDesign {
  // Hook
  export const useERPDesign = _useERPDesign;

  // Condition Area
  interface ConditionArea extends IChildren {
    size: number | string;
  }
  export function ConditionArea(props: ConditionArea) {
    const { size, children } = props;

    function makeTemplate() {
      if (typeof size === 'number') {
        return `repeat(${size}, 1fr)`;
      } else {
        return size;
      }
    }

    return (
      <DivisionBox data-container="erpDesign.ConditionArea" template={makeTemplate()} verticalAlign={'center'} gap={10}>
        {children}
      </DivisionBox>
    );
  }

  interface ConditionProps extends IChildren {
    label: string;
    name: NamePath | undefined;
    rules?: Rule[] | undefined;
  }
  export function Condition(props: ConditionProps) {
    const { label, name, rules, children } = props;
    return (
      <DivisionBox className="condition-box" template="max-content auto" verticalAlign={'center'} gap={10}>
        <span className="label-box">
          <em>{label}</em>
        </span>
        <Form.Item name={name} rules={rules}>
          {children}
        </Form.Item>
      </DivisionBox>
    );
  }

  // Control Area
  interface ControlAreaProps extends IChildren {
    onClick?: () => void;
  }
  export function ControlArea(props: ControlAreaProps) {
    const { children } = props;
    return (
      <DivisionBox data-container="erpDesign.controlArea" template={'max-content'} horizonAlign="right" gap={5} repeat>
        {children}
      </DivisionBox>
    );
  }

  interface SubmitProps extends IChildren {
    onClick?: () => void;
  }
  export function Submit(props: SubmitProps) {
    const { onClick = () => {}, children } = props;


    return <Button onClick={(e) => onClick()}>{children}</Button>;
  }

  // Table Area
  interface TableAreaProps extends IChildren {
    className?: string;
  }
  export function TableArea(props: TableAreaProps) {
    const { children, className } = props;

    return (
      <DivisionBox data-container="erpDesign.tableArea" template={'100%'} gap={5} repeat className={className}>
        {children}
      </DivisionBox>
    );
  }

  interface TableProps {
    columns?: Column<any>[];
    data?: {
      row: any[];
      set: React.Dispatch<React.SetStateAction<any[]>>;
    };
  }

  export function Table(props: TableProps) {
    const {
      columns = [],
      data = {
        row: [],
        set: (value) => {},
      },
    } = props;

    const ref = React.useRef<DataSheetGridRef>(null);
    return <DataSheetGrid ref={ref} value={data.row} onChange={data.set} columns={columns}></DataSheetGrid>;
  }
}

export default ERPDesign;
