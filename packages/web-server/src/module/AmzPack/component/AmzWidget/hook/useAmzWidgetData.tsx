/*------------------------------------------------------------------------------------------------------------------------------------------
 * Widget.tsx
 * WRITER : 최정근
 * DATE : 2022-05-11
 * DISCRIPTION : Use AMZ widget data
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/

import React from 'react';
import AmzWidgetData from '../type';

export interface IUseAmzWidgetData {
  data: AmzWidgetData.PayloadType;
  set: (payload: AmzWidgetData.PayloadType) => void;
  getWidgetData: (id: string) => AmzWidgetData.IWidget | null;
  registWidget: (widget: AmzWidgetData.IWidget) => void;
  terminateWidget: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  changeCondition: (id: string, condition: AmzWidgetData.IWidget['condition']) => void;
  selectWidget: (id: string) => void;
}

export const useAmzWidgetData = (): IUseAmzWidgetData => {
  const initialValue: AmzWidgetData.PayloadType = {
    selected: '',
    widgets: [],
  };

  const reducer = (
    state: AmzWidgetData.PayloadType,
    { type, payload }: { type: AmzWidgetData.ActionEnum; payload: any },
  ): AmzWidgetData.PayloadType => {
    switch (type) {
      case AmzWidgetData.ActionEnum.SET:
        return { ...payload };
      case AmzWidgetData.ActionEnum.CLEAR:
        return { ...initialValue };

      case AmzWidgetData.ActionEnum.REGIST:
        let isExist = state.widgets.some((ele) => ele.id === payload.widgets[0].id);

        if (isExist) {
          return { ...state };
        } else {
          let widgets = [...state.widgets, ...payload.widgets];
          return { ...state, widgets };
        }

      case AmzWidgetData.ActionEnum.TERMINATE:
        let idxA = state.widgets.findIndex((ele) => ele.id === payload.selected);

        if (idxA === -1) {
          return { ...state };
        } else {
          let widgets = [...state.widgets].splice(idxA, 1);
          return { ...state, widgets };
        }

      case AmzWidgetData.ActionEnum.OPEN:
        let idxB = state.widgets.findIndex((ele) => ele.id === payload.selected);
        if (idxB === -1) {
          return { ...state };
        } else {
          let widgets = [...state.widgets];
          widgets[idxB].condition = 'INIT';
          return { ...state, widgets, selected: widgets[idxB].id };
        }

      case AmzWidgetData.ActionEnum.CLOSE:
        let idxC = state.widgets.findIndex((ele) => ele.id === payload.selected);

        if (idxC === -1) {
          return { ...state };
        } else {
          let widgets = [...state.widgets];
          widgets[idxC].condition = 'CLOSED';
          return { ...state, widgets, selected: '' };
        }

      case AmzWidgetData.ActionEnum.CHANGE_CONDITION:
        let idxD = state.widgets.findIndex((ele) => ele.id === payload.widgets[0].id);

        if (idxD === -1) {
          return { ...state };
        } else {
          let widgets = [...state.widgets];
          widgets[idxD].condition = payload.widgets[0].condition;
          return { ...state, widgets };
        }

      case AmzWidgetData.ActionEnum.SELECT_WIDGET:
        return { ...state, selected: payload.selected };

      default:
        return { ...state };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialValue);

  const getWidgetData = (id: string) => {
    let idx = state.widgets.findIndex((ele) => ele.id === id);

    if (idx === -1) {
      return null;
    } else {
      return state.widgets[idx];
    }
  };

  const set = (payload: AmzWidgetData.PayloadType) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.SET,
      payload: payload,
    });
  };

  const registWidget = (widget: AmzWidgetData.IWidget) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.REGIST,
      payload: { widgets: [widget] },
    });
  };

  const terminateWidget = (id: string) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.TERMINATE,
      payload: { selected: id },
    });
  };

  const open = (id: string) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.OPEN,
      payload: { selected: id },
    });
  };

  const close = (id: string) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.CLOSE,
      payload: { selected: id },
    });
  };

  const changeCondition = (id: string, condition: AmzWidgetData.IWidget['condition']) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.CHANGE_CONDITION,
      payload: { widgets: [{ id, condition }] },
    });
  };

  const selectWidget = (id: string) => {
    dispatch({
      type: AmzWidgetData.ActionEnum.SELECT_WIDGET,
      payload: { selected: id },
    });
  };

  return {
    data: state,
    set,
    getWidgetData,
    registWidget,
    terminateWidget,
    open,
    close,
    changeCondition,
    selectWidget,
  };
};
