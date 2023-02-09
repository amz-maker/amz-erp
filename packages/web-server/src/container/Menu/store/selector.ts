import { selectorFamily } from 'recoil';
import { menuState, IMenuState, IMenuStateId } from './atom';

// Menu State
export namespace MenuStateSelector {
  export const modeSelector = selectorFamily<IMenuState['mode'], IMenuStateId>({
    key: 'menuStateSelector.modeSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(menuState(id));
        return data.mode;
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(menuState(id), (s) => {
          return {
            ...s,
            mode: newValue as number,
          };
        });
      },
  });
}
