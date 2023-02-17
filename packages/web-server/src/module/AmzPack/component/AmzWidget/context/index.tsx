import { createContext } from 'react';
import { IUseAmzWidgetData } from '../hook/useAmzWidgetData';

export namespace AmzWidgetContext {
  export const DataContext = createContext<IUseAmzWidgetData>({
    data: {
      selected: '',
      widgets: [],
    },
    set: () => {},
    getWidgetData: () => {
      return null;
    },
    registWidget: () => {},
    terminateWidget: () => {},
    open: () => {},
    close: () => {},
    changeCondition: () => {},
    selectWidget: () => {},
  });
}
