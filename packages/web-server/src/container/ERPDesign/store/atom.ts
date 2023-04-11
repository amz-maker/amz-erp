import { atomFamily } from 'recoil';

// Table State
export type ITableStateId = string;
type rows = (string | number)[]
export interface ITableState {
  table: any[];
  updateRows: Map<number,any>;
}
const initTableState: ITableState = {
  table: [],
  updateRows: new Map<number,any>(),
};

const tableState = atomFamily<ITableState, ITableStateId>({
  key: 'State',
  default: (id: ITableStateId) => initTableState,
});


export { tableState };
