import { selectorFamily } from 'recoil';
import { tableState, ITableState, ITableStateId } from './atom';

// Table State
export namespace TableStateSelector {
  export const tableSelector = selectorFamily<ITableState['table'], ITableStateId>({
    key: 'tableStateSelector.tableSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(tableState(id));
        return data.table;
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(tableState(id), (s) => {
          return {
            ...s,
            table: newValue as any,
          };
        });
      },
  });

  // export const tableRowSelector = selectorFamily<ITableState['table'], ITableStateId>({
  //   key: 'tableStateSelector.tableRowSelector',
  //   get:
  //     (id) =>
  //     ({ get }) => {
  //       const data = get(tableState(id));
  //       return data.row;
  //     },
  //   set:
  //     (id) =>
  //     ({ set }, newValue) => {
  //       set(tableState(id), (s) => {
  //         return {
  //           ...s,
  //           row: newValue as object,
  //         };
  //       });
  //     },
  // });
  
  // export const tableCellSelector = selectorFamily<ITableState['table'], ITableStateId>({
  //   key: 'tableStateSelector.tableCellSelector',
  //   get:
  //     (id) =>
  //     ({ get }) => {
  //       const data = get(tableState(id));
  //       return data.table;
  //     },
  //   set:
  //     (id) =>
  //     ({ set }, newValue) => {
  //       set(tableState(id), (s) => {
  //         return {
  //           ...s,
  //           table: newValue as any[],
  //         };
  //       });
  //     },
  // });

  
  export const updateRowsSelector = selectorFamily<ITableState['updateRows'], ITableStateId>({
    key: 'tableStateSelector.updateRowsSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(tableState(id));
        return data.updateRows;
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(tableState(id), (s) => {
          if(s.updateRows == null){
            return s;
          }
          if(newValue == undefined || newValue === null){
            s.updateRows.clear()
          }else{
            console.log("newValue - ",newValue)
            newValue = newValue as Map<number,any>;
            // newValue는 하나만 가지고있음.
            const index: number = newValue.keys().next().value;
            const newData = newValue.values().next().value;
            const preData = s.updateRows.get(index);
            // 맵에 처음들어온 데이터는 삽입합니다.
            if(preData == undefined){
              s.updateRows.set(index,newData)
            }
            // 기존 데이터가 C 인데 U가 들어오면 rowEvent를 C로 그대로 두고, 데이터만 업데이트합니다.
            else if(preData.rowEvent == "C" && newData.rowEvent == "U"){
              s.updateRows.set(index,{...newData,rowEvent:"C"})
            }
            // 기존 데이터가 C 인데 D가 들어오면 그대로 데이터를 삭제합니다.
            else if(preData.rowEvent == "C" && newData.rowEvent == "D"){
              s.updateRows.delete(index)
            }
            // 기존 데이터가 U 인데 U가 들어오면 rowEvent를 U로 그대로 두고, 데이터만 업데이트합니다.
            else if(preData.rowEvent == "U" && newData.rowEvent == "U"){
              s.updateRows.set(index,{...newData,rowEvent:"U"})
            }
            // 기존 데이터가 U 인데 D가 들어오면 삭제될 데이터임을 표시합니다
            else if(preData.rowEvent == "U" && newData.rowEvent == "D"){
              s.updateRows.set(index,{...newData,rowEvent:"D"})
            }
            // 기존 데이터가 D 이면 아무행동 하지 않습니다.
            else if(preData.rowEvent == "D"){
              
            }
          }
          return {
            ...s,
          };
        });
      },
  });

}
