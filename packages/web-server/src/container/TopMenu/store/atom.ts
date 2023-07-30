import { atomFamily } from 'recoil';

// TopMenu State
export type ITopMenuStateId = string;
export interface ITopMenuState {
  loginCond: boolean;
}
const initTopMenuState: ITopMenuState = {
  loginCond: false,
};

const topMenuState = atomFamily<ITopMenuState, ITopMenuStateId>({
key: 'State',
  default: (id: ITopMenuStateId) => initTopMenuState,
});

export { topMenuState };
