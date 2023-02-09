import { atomFamily } from 'recoil';

// Menu State
export type IMenuStateId = string;
export interface IMenuState {
  mode: number;
}
const initMenuState: IMenuState = {
  mode: 0,
};

const menuState = atomFamily<IMenuState, IMenuStateId>({
  key: 'State',
  default: (id: IMenuStateId) => initMenuState,
});

export { menuState };
