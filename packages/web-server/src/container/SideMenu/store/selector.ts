import { selectorFamily } from 'recoil';
import { sideMenuState, ISideMenuState, ISideMenuStateId } from './atom';

// SideMenu State
export namespace SideMenuStateSelector {
  export const modeSelector = selectorFamily<ISideMenuState['mode'], ISideMenuStateId>({
    key: 'menuStateSelector.modeSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(sideMenuState(id));
        return data.mode;
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(sideMenuState(id), (s) => {
          return {
            ...s,
            mode: newValue as number,
          };
        });
      },
  });
}
