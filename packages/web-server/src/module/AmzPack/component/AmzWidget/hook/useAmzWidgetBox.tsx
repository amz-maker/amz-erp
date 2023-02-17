/*------------------------------------------------------------------------------------------------------------------------------------------
 * Widget.tsx
 * WRITER : 최정근
 * DATE : 2022-05-11
 * DISCRIPTION : Use AMZ widget box
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/

import React from 'react';
import { AmzWidgetContext } from '../context';

export const useAmzWidgetBox = () => {
  const widgetData = React.useContext(AmzWidgetContext.DataContext);

  React.useEffect(() => {
    return () => {};
  }, []);

  return widgetData;
};
