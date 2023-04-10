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

  
  export const updateRowsSelector = selectorFamily<ITableState['table'], ITableStateId>({
    key: 'tableStateSelector.updateRowsSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(tableState(id));
        return [data.updateRows];
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(tableState(id), (s) => {
          newValue = newValue as any[]
          if(newValue == undefined || newValue.length != 2){
            s.updateRows.clear()
          }else if(newValue.length == 2){
            // 맵에 처음들어온 데이터는 삽입합니다.
            if(s.updateRows.get(newValue[0]) == undefined){
              s.updateRows.set(newValue[0],newValue[1])
            }
            // 기존 데이터가 C 인데 D가 들어오면 그대로 데이터를 삭제합니다.
            else if(s.updateRows.get(newValue[0]) == "C" && newValue[1] == "D"){
              s.updateRows.delete(newValue[0])
            }
            // 기존 데이터가 C 인데 U가 들어오면 아무행동 하지 않습니다.
            else if(s.updateRows.get(newValue[0]) == "C" && newValue[1] == "U"){
              
            }
            // 기존 데이터가 U 인데 D가 들어오면 삭제될 데이터임을 표시합니다
            else if(s.updateRows.get(newValue[0]) == "U" && newValue[1] == "D"){
              s.updateRows.set(newValue[0],newValue[1])
            }
            // 기존 데이터가 D 이면 아무행동 하지 않습니다.
            else if(s.updateRows.get(newValue[0]) == "D"){
              
            }
          }
          return {
            ...s,
          };
        });
      },
  });

}
