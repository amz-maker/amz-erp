/*------------------------------------------------------------------------------------------------------------------------------------------
 * Widget.tsx
 * WRITER : 최정근
 * DATE : 2022-05-09
 * DISCRIPTION : Widget layout
 * TYPE : Layout
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
// import DivisionBox from 'common/component/AmzDesign/DivisionBox';
// import Scrollbar from 'common/component/AmzDesign/Scrollbar';
import { AmzWidgetContext } from '../../context';
import AmzWidget from '../../AmzWidget';
import classNames from 'classnames';
// import Icon from 'common/component/AmzDesign/Icon';
import { useAmzWidgetData } from '../../hook/useAmzWidgetData';
// import { useDispatch } from 'react-redux';
// import LayoutScrollAction from 'data/reducer/LayoutScroll/LayoutScrollAction';
// import { useSelector } from 'react-redux';
// import { RootState } from 'data/store';
// import LayoutScrollData from 'data/reducer/LayoutScroll/LayoutScrollData';

interface WidgetLayoutProps {
  className?: string | undefined;
  children?: React.ReactNode;
}

const WidgetLayout: React.FC<WidgetLayoutProps> = (props) => {
  /*
  const { className, children } = props;
  const widgetData = useAmzWidgetData();
  const widgets = widgetData.data.widgets;
  const dispatch = useDispatch();
  const [triggerScrollUp, setTriggerScrollUp] = React.useState<() => void>(() => {});
  const [triggerScrollRight, setTriggerScrollRight] = React.useState<() => void>(() => {});
  const [triggerScrollDown, setTriggerScrollDown] = React.useState<() => void>(() => {});
  const [triggerScrollLeft, setTriggerScrollLeft] = React.useState<() => void>(() => {});
  const [triggerScrollTo, setTriggerScrollTo] = React.useState<(action: ScrollToOptions) => void>(() => {});

  React.useEffect(() => {
    if (!!triggerScrollUp && !!triggerScrollRight && !!triggerScrollDown && !!triggerScrollLeft && !!triggerScrollTo) {
      dispatch(
        LayoutScrollAction.set({
          scrollUp: triggerScrollUp,
          scrollRight: triggerScrollRight,
          scrollDown: triggerScrollDown,
          scrollLeft: triggerScrollLeft,
          scrollTo: triggerScrollTo,
        }),
      );
    }
  }, [triggerScrollUp, triggerScrollRight, triggerScrollDown, triggerScrollLeft, triggerScrollTo]);

  const printMinimizeWidget = () => {
    return (
      <DivisionBox template="min-content">
        {widgets.map((ele, idx) => {
          return ele.condition === 'MINIMIZE' ? <MinimizeWidget id={ele.id} /> : null;
        })}
      </DivisionBox>
    );
  };

  const InnerWidgetLayout = () => {
    return (
      <>
        <Scrollbar
          className={'widget-scrollbar'}
          triggerScrollUp={setTriggerScrollUp}
          triggerScrollRight={setTriggerScrollRight}
          triggerScrollDown={setTriggerScrollDown}
          triggerScrollLeft={setTriggerScrollLeft}
          triggerScrollTo={setTriggerScrollTo}
        >
          <div className={classNames('widget-manager-area', className)}>{children}</div>
        </Scrollbar>
        <DivisionBox className="task-manager-area">{printMinimizeWidget()}</DivisionBox>
      </>
    );
  };

  return (
    <div data-layout="widgetLayout">
      {!!widgetData ? (
        <AmzWidgetContext.DataContext.Provider value={widgetData}>{InnerWidgetLayout()}</AmzWidgetContext.DataContext.Provider>
      ) : (
        InnerWidgetLayout()
      )}
    </div>
  );
   */
  return <></>
};

interface MinimizeWidgetProps {
  id: string;
}
const MinimizeWidget: React.FC<MinimizeWidgetProps> = (props) => {
  /*
  const { id } = props;
  const widgetData = AmzWidget.useAmzWidget(id);
  const widgetInfo = widgetData.getWidgetData();

  return (
    <div
      data-component="minimizeWidget"
      onClick={() => {
        widgetData.changeCondition('DEFAULT');
      }}
    >
      <DivisionBox className="wrapper" template="auto min-content" gap="5px" itemsVertical="center">
        <em className="title">{widgetInfo?.name ?? '-'}</em>
        <Icon
          className="icon"
          name="xmark"
          type="solid"
          onClick={(e) => {
            e.stopPropagation();
            widgetData.close();
          }}
        />
      </DivisionBox>
    </div>
  );
   */
  return <></>
};

export default WidgetLayout;
