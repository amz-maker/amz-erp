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
          // 여기서 newValue의 형태는 newValue[0] = Key, newValue[1] = Value 의 형태이지만,
          // 일단 newValue를 배열의 형태가 아닌 object의 형태로 바꾸지 못해서 임시로 이렇게 해두었습니다.
          newValue = newValue as any[]
          if(newValue == undefined || newValue.length != 2){
            s.updateRows.clear()
          }else if(newValue.length == 2){
            // 맵에 처음들어온 데이터는 삽입합니다.
            if(s.updateRows.get(newValue[0]) == undefined){
              s.updateRows.set(newValue[0],newValue[1])
            }
            // 기존 데이터가 C 인데 D가 들어오면 그대로 데이터를 삭제합니다.
            else if(s.updateRows.get(newValue[0]).rowEvent == "C" && newValue[1].rowEvent == "D"){
              s.updateRows.delete(newValue[0])
            }
            // 기존 데이터가 C 인데 U가 들어오면 rowEvent를 C로 그대로 두고, 데이터만 업데이트합니다.
            else if(s.updateRows.get(newValue[0]).rowEvent == "C" && newValue[1].rowEvent == "U"){
              s.updateRows.set(newValue[0],{...newValue[1],rowEvent:"C"})
            }
            // 기존 데이터가 U 인데 D가 들어오면 삭제될 데이터임을 표시합니다
            else if(s.updateRows.get(newValue[0]).rowEvent == "U" && newValue[1].rowEvent == "D"){
              s.updateRows.set(newValue[0],newValue[1])
            }
            // 기존 데이터가 D 이면 아무행동 하지 않습니다.
            else if(s.updateRows.get(newValue[0]).rowEvent == "D"){
              
            }
          }
          return {
            ...s,
          };
        });
      },
  });

}
