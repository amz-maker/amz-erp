import { atomFamily } from 'recoil';

// SideMenu State
export type ISideMenuStateId = string;
export interface ISideMenuState {
  mode: number;
}
const initSideMenuState: ISideMenuState = {
  mode: 0,
};

const sideMenuState = atomFamily<ISideMenuState, ISideMenuStateId>({
  key: 'State',
  default: (id: ISideMenuStateId) => initSideMenuState,
});

export { sideMenuState };
