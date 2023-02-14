import { selectorFamily } from 'recoil';
import { topMenuState, ITopMenuState, ITopMenuStateId } from './atom';

// TopMenu State
export namespace TopMenuStateSelector {
  export const loginCondSelector = selectorFamily<ITopMenuState['loginCond'], ITopMenuStateId>({
    key: 'menuStateSelector.loginCondSelector',
    get:
      (id) =>
      ({ get }) => {
        const data = get(topMenuState(id));
        return data.loginCond;
      },
    set:
      (id) =>
      ({ set }, newValue) => {
        set(topMenuState(id), (s) => {
          return {
            ...s,
            loginCond: newValue as boolean,
          };
        });
      },
  });
}
