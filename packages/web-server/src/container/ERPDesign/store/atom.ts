import { atomFamily } from 'recoil';

// Table State
export type ITableStateId = string;
export interface ITableState {
  table: any[];
  updateRows: Map<number,string>;
}
const initTableState: ITableState = {
  table: [],
  updateRows: new Map<number,string>(),
};

const tableState = atomFamily<ITableState, ITableStateId>({
  key: 'State',
  default: (id: ITableStateId) => initTableState,
});


export { tableState };
