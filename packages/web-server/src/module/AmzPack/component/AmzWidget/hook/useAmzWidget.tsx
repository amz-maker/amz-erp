/*------------------------------------------------------------------------------------------------------------------------------------------
 * Widget.tsx
 * WRITER : 최정근
 * DATE : 2022-05-11
 * DISCRIPTION : Use AMZ widget
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/

import React from 'react';
import { AmzWidgetContext } from '../context';
import AmzWidgetData from '../type';

export interface IUseAmzWidget {
  data: AmzWidgetData.PayloadType;
  getWidgetData: () => void;
  registWidget: (widget: AmzWidgetData.IWidget) => void;
  terminateWidget: () => void;
  open: () => void;
  close: () => void;
  changeCondition: (condition: AmzWidgetData.IWidget['condition']) => void;
}

export const useAmzWidget = (id: string) => {
  const widgetData = React.useContext(AmzWidgetContext.DataContext);

  React.useEffect(() => {
    return () => {};
  }, []);

  const getWidgetData = () => {
    return widgetData.getWidgetData(id);
  };

  const registWidget = (widget: AmzWidgetData.IWidget) => {
    widgetData.registWidget(widget);
  };

  const terminateWidget = () => {
    widgetData.terminateWidget(id);
  };

  const open = () => {
    widgetData.open(id);
  };

  const close = () => {
    widgetData.close(id);
  };

  const changeCondition = (condition: AmzWidgetData.IWidget['condition']) => {
    widgetData.changeCondition(id, condition);
  };

  return {
    data: widgetData.data,
    getWidgetData,
    registWidget,
    terminateWidget,
    open,
    close,
    changeCondition,
  };
};
