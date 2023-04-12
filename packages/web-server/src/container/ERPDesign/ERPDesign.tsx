/*------------------------------------------------------------------------------------------------------------------------------------------
 * ERPDesign.tsx
 * WRITER : 최정근
 * DATE : 2023-02-15
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React, { useRef } from 'react';
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
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { NamePath } from 'antd/es/form/interface';
import Util from 'common/util';
import { TableStateSelector } from './store/selector';

interface ERPDesignProps<T extends object> extends IChildren, IDataPage {
  onFinish?: ((values: T) => void) | undefined;
  onFinishFailed?: ((errorInfo: any) => void) | undefined;
  formref: React.RefObject<FormInstance<any>>;
}
function ERPDesign<T extends object>(props: ERPDesignProps<T>) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { 'data-page': dataPage, formref, children } = props;

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    // <RecoilRoot>
      <Form {...props} ref={formref}>
        <div data-page={dataPage} data-container="erpDesign">
          {children}
        </div>
      </Form>
    // </RecoilRoot>
  );
}

namespace ERPDesign {
  // Hook
  export const useERPDesign = _useERPDesign;

  // Util Function
  // CRUD가 포함된 데이터들을 해당 함수를통해 C,U,D 각각의 배열로 분리해서 반환합니다.
  export function dataDivider(updateRows:Map<number,any>){
    // const updateRows = updateRowsArr[0] as Map<number,any>
    const createData: any[] = []
    const updateData: any[] = []
    const deleteData: any[] = []
    
    updateRows.forEach((value,key)=>{
      if(value.rowEvent == "C"){
        createData.push(value)
      }else if(value.rowEvent == "U"){
        updateData.push(value)
      }else if(value.rowEvent == "D"){
        deleteData.push(value)
      }}
    )

    return {
      createData,
      updateData,
      deleteData
    }
    // return updateRowsArr
  }



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
    rowSpan?: number;
    colSpan?: number;
  }
  export function Condition(props: ConditionProps) {
    const { label, name, rules, children, rowSpan = 1, colSpan = 1 } = props;
    const divisionProps = { rowSpan, colSpan };
    return (
      <DivisionBox.Span className="condition-box" template="max-content auto" verticalAlign={'center'} gap={10} {...divisionProps}>
        <span className="label-box">
          <em>{label}</em>
        </span>
        <Form.Item name={name} rules={rules}>
          {children}
        </Form.Item>
      </DivisionBox.Span>
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
    createdRowIds?: Set<any>;
    updatedRowIds?: Set<any>;
    deletedRowIds?: Set<any>;
    tableName?: string;
  }

  export function Table(props: TableProps) {
    const {
      columns = [],
      data = {
        row: [],
        set: (value) => {},
      },
      tableName = "",
    } = props;
    
    const [table,setTable] = useRecoilState(TableStateSelector.tableSelector(tableName));
    const [updateRowsArr,setUpdateRows] = useRecoilState(TableStateSelector.updateRowsSelector(tableName));
    const updateRows = updateRowsArr[0] as Map<number,any>

    const ref = React.useRef<DataSheetGridRef>(null);
    const counter = useRef(1)
    const genId = () => counter.current++

    return (<DataSheetGrid 
      ref={ref} 
      value={table}
      // onChange={data.set} 
      columns={columns}
      rowClassName={({ rowData }) => {
        if(rowData.rowEvent === "C"){
          return "row-created"
        }
        else if(rowData.rowEvent === "U"){
          return "row-updated"
        }
        else if(rowData.rowEvent === "D"){
          return "row-deleted"
        }

      }}
      onChange={(newValue, operations) => {
        for (const operation of operations) {
          if (operation.type === 'CREATE') {
            newValue
              .slice(operation.fromRowIndex, operation.toRowIndex)
              .forEach((data) => {
                if(data.rowId == undefined){
                  data.rowId = genId()
                  data.rowEvent = "C"
                }
                setUpdateRows([data.rowId,{...data, rowId:data.rowId, rowEvent:"C"}])
              })
          }
          if (operation.type === 'UPDATE') {
            newValue
              .slice(operation.fromRowIndex, operation.toRowIndex)
              .forEach((data) => {
                if(data.rowId == undefined){
                  data.rowId = genId()
                  data.rowEvent = "U"
                }
                setUpdateRows([data.rowId,{...data, rowId:data.rowId, rowEvent:"U"}])
              })
          }
          if (operation.type === 'DELETE') {
            let keptRows = 0

            table
              .slice(operation.fromRowIndex, operation.toRowIndex)
              .forEach((data) => {
                // data의 id가 없을경우 새로운 id를 할당시켜주기위한 임시변수
                let newId = undefined
                if(data.rowId === undefined || updateRows.get(data.rowId).rowEvent === "U" || updateRows.get(data.rowId).rowEvent === "D"){
                  // datasheetgrid 특성상 삭제 액션을 취하면 행 자체를 지워버리기때문에 해당 행을 남기고 플래그를 추가하기위해 해당 행을 다시 추가합니다.
                  newValue.splice(
                    operation.fromRowIndex + keptRows++,
                    0,
                    {
                      ...data,
                      // data.rowId가 존재할경우 그대로 사용하고, 존재하지않으면 newId에 genId()의 값을 적용시켜 사용합니다.
                      rowId:data.rowId || (newId=genId()),
                      rowEvent:"D"
                    }
                  )
                }
                
                setUpdateRows([data.rowId || newId,{...data, rowId:data.rowId || newId, rowEvent:"D"}])
              })
              
          }
        }
        setTable(newValue);
      }}
      ></DataSheetGrid>);
  }
}

export default ERPDesign;
