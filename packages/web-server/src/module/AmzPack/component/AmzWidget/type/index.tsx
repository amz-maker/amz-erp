// import { DeepPartial } from 'redux';

namespace AmzWidgetData {
  export enum ActionEnum {
    SET,
    CLEAR,
    REGIST,
    TERMINATE,
    OPEN,
    CLOSE,
    CHANGE_CONDITION,
    SELECT_WIDGET,
  }

  export interface IWidget {
    id: string;
    name?: string;
    condition: 'INIT' | 'DEFAULT' | 'CLOSED' | 'MINIMIZE' | 'MAXIMIZE';
  }

  export type PayloadType = {
    selected: IWidget['id'];
    widgets: IWidget[];
  };

  export type DispatchType = {
    type: ActionEnum;
    payload: PayloadType;
  };

  export interface DispatchTypeDeepPartial {
    type: DispatchType['type'];
    // payload: DeepPartial<DispatchType['payload']>;
  }

  export type ContextValueType<T> = [T, React.Dispatch<DispatchType>];
}

export default AmzWidgetData;
