/*------------------------------------------------------------------------------------------------------------------------------------------
 * AmzWidget.tsx
 * WRITER : 최정근
 * DATE : 2022-05-09
 * DISCRIPTION : Amz widget
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
// import Draggable, { ControlPosition } from 'react-draggable';
// import { Resizable, ResizeCallback } from 're-resizable';
import DivisionBox from '../DivisionBox';
import Icon from '../Icon';

import WidgetLayout from './layout/WidgetLayout';
import AmzWidgetData from './type';
import { useAmzWidgetBox as innerUseAmzWidgetBox } from './hook/useAmzWidgetBox';
import { useAmzWidget as innerUseAmzWidget } from './hook/useAmzWidget';
// import Scrollbar from '../Scrollbar';

interface AmzWidgetProps {
  // id: string;
  // name?: string;
  // onResize?: ResizeCallback;
  // onOpen?: () => void;
  // onClose?: () => void;
  // centered?: boolean;
  // controller?: {
  //   condition: AmzWidgetData.IWidget['condition'];
  //   setCondition: (cond: AmzWidgetData.IWidget['condition']) => void;
  // };

  // //onMinimize: () => void;
  // 'data-widget'?: string;
  // options?: {
  //   grid?: [number, number];
  //   resizable?: boolean;
  // };

  // className?: string;
  // children: React.ReactNode;
}

function AmzWidget(props: AmzWidgetProps) {
  /*--------------------
   * Const
   *-------------------- */
  // Props
  // const {
  //   id,
  //   name = '',
  //   centered = false,
  //   onResize,
  //   onOpen = () => {},
  //   onClose = () => {},
  //   controller,
  //   'data-widget': dataWidget,
  //   options = { resizable: true },
  //   className,
  //   children,
  // } = props;

  // // State
  // const [fixed, setFixed] = React.useState<boolean>(false);
  // const [widgetlize, setWidgetlize] = React.useState<boolean>(false);
  // const [_condition, _setCondition] = React.useState<AmzWidgetData.IWidget['condition']>('INIT');
  // const [size, setSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
  // const [position, setposition] = React.useState<ControlPosition>({ x: 0, y: 0 });
  // const [parentNode, setParentNode] = React.useState<HTMLElement>();
  // const [direction, setDirection] = React.useState<{ top: boolean; right: boolean; bottom: boolean; left: boolean }>({
  //   top: true,
  //   right: false,
  //   bottom: false,
  //   left: true,
  // });
  // const [animation, setAnimation] = React.useState<boolean>(false);

  // // Reference
  // const nodeRef = React.useRef(null);
  // const boxRef = React.useRef(null);
  // const widgetBox = innerUseAmzWidgetBox();
  // const widget = innerUseAmzWidget(id);

  // // const resizeObserver = new window.ResizeObserver(() => {
  // //   console.log(nodeRef);
  // // });

  // /*--------------------
  //  * Controller
  //  *-------------------- */
  // const getCondition = () => {
  //   if (!!widget) {
  //     return widget.getWidgetData()?.condition;
  //   } else if (!!controller) {
  //     return controller.condition;
  //   } else {
  //     return _condition;
  //   }
  // };
  // const setCondition = (cond: AmzWidgetData.IWidget['condition']) => {
  //   if (!!widget) {
  //     widget.changeCondition(cond);
  //   } else if (!!controller) {
  //     controller.setCondition(cond);
  //   } else {
  //     _setCondition(cond);
  //   }
  // };

  // /*--------------------
  //  * Function
  //  *-------------------- */

  // // 위치 고정 토글
  // const toggleFixed = () => {
  //   setFixed(!fixed);
  // };

  // // 위젯화 토글
  // const toggleWidgetlize = () => {
  //   setWidgetlize(!widgetlize);
  // };

  // // 최소화 토글
  // const toggleMinimize = () => {
  //   setCondition(getCondition() !== 'MINIMIZE' ? 'MINIMIZE' : 'DEFAULT');
  // };

  // // 최대화 토글
  // const toggleMaximize = () => {
  //   // WidgetLize 상태에서는 최대화 토글 사용불가
  //   if (widgetlize) return;

  //   setCondition(getCondition() !== 'MAXIMIZE' ? 'MAXIMIZE' : 'DEFAULT');
  // };

  // // Absolute 방향 토글
  // const toggleDirection = (dirA: 'top' | 'bottom', dirB: 'left' | 'right') => {
  //   let temp: typeof direction = { top: false, right: false, bottom: false, left: false };
  //   temp[dirA] = true;
  //   temp[dirB] = true;
  //   setDirection(temp);
  // };

  // // 닫기
  // const onClickClose = () => {
  //   setCondition('CLOSED');
  // };

  // // Resize 적용
  // const onResizeStop: ResizeCallback = (e, direction, ref, d) => {
  //   setSize({
  //     width: size.width + d.width,
  //     height: size.height + d.height,
  //   });
  // };

  // // 이벤트 전파 방지
  // const stopPropagation: React.MouseEventHandler = (e) => {
  //   e.stopPropagation();
  // };

  // // Absolute 위치 계산
  // const getAbsolutePositionStyle = (): React.CSSProperties => {
  //   if (!!nodeRef.current && !!parentNode) {
  //     const my = nodeRef.current as HTMLElement;
  //     const parentBounding = parentNode.getBoundingClientRect();
  //     const myBounding = my.getBoundingClientRect();

  //     return {
  //       top: direction.top ? myBounding.top - parentBounding.top : 'auto',
  //       right: direction.right ? parentBounding.right - myBounding.right : 'auto',
  //       bottom: direction.bottom ? parentBounding.bottom - myBounding.bottom : 'auto',
  //       left: direction.left ? myBounding.left - parentBounding.left : 'auto',
  //     };
  //   }
  //   return {};
  // };

  // /*--------------------
  //  * Use Effect
  //  *-------------------- */
  // React.useEffect(() => {
  //   // Size 초기값 설정
  //   if (!!boxRef.current) {
  //     const element = boxRef.current as Element;
  //     setSize({
  //       width: element.clientWidth,
  //       height: element.clientHeight,
  //     });
  //   }

  //   // Parent node 설정
  //   if (!!nodeRef.current) {
  //     // Parent node 설정
  //     const parent = ReactDOM.findDOMNode(nodeRef.current)?.parentNode as HTMLElement;
  //     setParentNode(parent);
  //   }

  //   // Widget 등록
  //   if (!!widget) {
  //     widget.registWidget({
  //       id,
  //       name,
  //       condition: 'CLOSED',
  //     });
  //   }

  //   // Release
  //   return () => {
  //     if (!!widget) {
  //       widget.terminateWidget();
  //     }

  //     //resizeObserver.disconnect();
  //   };
  // }, []);

  // React.useEffect(() => {
  //   switch (getCondition()) {
  //     case 'INIT':
  //       // Center position 설정
  //       if (!!nodeRef.current && !!parentNode && centered) {
  //         const my = nodeRef.current as HTMLElement;
  //         setposition({
  //           x: (parentNode.clientWidth - my.clientWidth) / 2,
  //           y: (parentNode.clientHeight - my.clientHeight) / 2,
  //         });
  //       }
  //       onOpen();
  //       break;
  //     case 'CLOSED':
  //       onClose();
  //       break;
  //   }
  // }, [getCondition()]);

  // return getCondition() !== 'CLOSED' ? (
  //   <Draggable
  //     nodeRef={nodeRef}
  //     disabled={fixed || widgetlize}
  //     bounds={'parent'}
  //     handle=".controller-area"
  //     grid={options.grid}
  //     position={position}
  //     onDrag={(e, data) => {
  //       setposition({
  //         x: position.x + data.deltaX,
  //         y: position.y + data.deltaY,
  //       });
  //     }}
  //   >
  //     <div
  //       onClick={() => widgetBox.selectWidget(id)}
  //       ref={nodeRef}
  //       data-container="amzWidget"
  //       onAnimationStart={() => {
  //         setAnimation(true);
  //       }}
  //       onAnimationEnd={() => {
  //         setAnimation(false);
  //       }}
  //       style={{
  //         ...(widgetlize && getAbsolutePositionStyle()),
  //       }}
  //       className={classNames(
  //         getCondition() === 'MAXIMIZE' ? 'maximize' : '',
  //         getCondition() === 'MINIMIZE' ? 'minimize' : '',
  //         getCondition() === 'DEFAULT' ? 'default' : '',
  //         widgetlize ? 'widgetlize' : '',
  //         animation ? 'animation' : '',
  //         widgetBox.data.selected === id ? 'top-layer' : '',
  //       )}
  //     >
  //       <DivisionBox className="wrapper" template="20px auto" type="vertical">
  //         {/* ---------- 위젯 컨트롤러 ---------- */}
  //         <div
  //           className={classNames('controller-area', widgetlize ? 'widgetlize' : '', widgetBox.data.selected === id ? 'top-layer' : '')}
  //           onDoubleClick={toggleMaximize}
  //         >
  //           {/* ----- 타이틀 ----- */}
  //           <DivisionBox itemsHorizon="start">
  //             {/* 타이틀 */}
  //             <span className="title-box">
  //               <em>{widget.getWidgetData()?.name ?? ''}</em>
  //             </span>
  //           </DivisionBox>
  //           {/* ----- 위치 고정 ----- */}
  //           {widgetlize ? null : (
  //             <DivisionBox template="auto min-content" itemsVertical="center">
  //               {/* Absolute 방향 설정 */}
  //               <span onClick={() => toggleDirection('top', 'left')} onDoubleClick={stopPropagation}>
  //                 <Icon
  //                   className={classNames('icon', 'direction', direction.top && direction.left ? '' : 'disabled')}
  //                   name={'border-top-left'}
  //                   type="solid"
  //                 />
  //               </span>
  //               <span onClick={() => toggleDirection('top', 'right')} onDoubleClick={stopPropagation}>
  //                 <Icon
  //                   className={classNames('icon', 'direction', direction.top && direction.right ? '' : 'disabled')}
  //                   name={'border-top-left'}
  //                   type="solid"
  //                   rotate="90"
  //                 />
  //               </span>
  //               <span onClick={() => toggleDirection('bottom', 'right')} onDoubleClick={stopPropagation}>
  //                 <Icon
  //                   className={classNames('icon', 'direction', direction.bottom && direction.right ? '' : 'disabled')}
  //                   name={'border-top-left'}
  //                   type="solid"
  //                   rotate="180"
  //                 />
  //               </span>
  //               <span onClick={() => toggleDirection('bottom', 'left')} onDoubleClick={stopPropagation}>
  //                 <Icon
  //                   className={classNames('icon', 'direction', direction.bottom && direction.left ? '' : 'disabled')}
  //                   name={'border-top-left'}
  //                   type="solid"
  //                   rotate="270"
  //                 />
  //               </span>
  //               {/* 위치 고정 */}
  //               <span onClick={toggleFixed} onDoubleClick={stopPropagation}>
  //                 <Icon className={classNames('icon', 'fixed', fixed ? '' : 'disabled')} name={'thumbtack'} type="solid" />
  //               </span>
  //             </DivisionBox>
  //           )}
  //           {/* ----- 위젯화 ----- */}
  //           <DivisionBox itemsVertical="center">
  //             {/* 위젯화 */}
  //             <span onClick={toggleWidgetlize} onDoubleClick={stopPropagation}>
  //               <Icon className={classNames('icon', 'widgetlize', widgetlize ? '' : 'disabled')} name={'ghost'} type="solid" />
  //             </span>
  //           </DivisionBox>
  //           {/* ----- 최소화, 최대화, 닫기 ----- */}
  //           {widgetlize ? null : (
  //             <DivisionBox itemsVertical="center">
  //               {/* 최소화 */}
  //               <span onClick={toggleMinimize} onDoubleClick={stopPropagation}>
  //                 <Icon className="icon" name={'window-minimize'} type="solid" />
  //               </span>
  //               {/* 최대화 */}
  //               <span onClick={toggleMaximize} onDoubleClick={stopPropagation}>
  //                 <Icon className={classNames('icon', getCondition() === 'MAXIMIZE' ? 'maximize' : '')} name={'window-maximize'} type="solid" />
  //               </span>
  //               {/* 닫기 */}
  //               <span onClick={onClickClose} onDoubleClick={stopPropagation}>
  //                 <Icon className="icon" name={'xmark'} type="solid" />
  //               </span>
  //             </DivisionBox>
  //           )}
  //         </div>
  //         {/* ---------- 위젯 컨텐츠 ---------- */}
  //         <Resizable
  //           onResize={onResize}
  //           bounds={parentNode}
  //           className={classNames(
  //             'content-area',
  //             getCondition() === 'MAXIMIZE' ? 'maximize' : '',
  //             widgetlize ? 'widgetlize' : '',
  //             animation ? 'animation' : '',
  //           )}
  //           minWidth={animation ? size.width : undefined}
  //           minHeight={animation ? size.height : undefined}
  //           size={size}
  //           onResizeStop={onResizeStop}
  //           enable={
  //             !!!options.resizable || widgetlize
  //               ? {}
  //               : {
  //                   right: true,
  //                   bottom: true,
  //                   bottomRight: true,
  //                 }
  //           }
  //         >
  //           <Scrollbar>
  //             <div ref={boxRef} data-widget={dataWidget} className={classNames('content-box', className)}>
  //               {children}
  //             </div>
  //           </Scrollbar>
  //         </Resizable>
  //       </DivisionBox>
  //     </div>
  //   </Draggable>
  // ) : null;
  return <></>
}

namespace AmzWidget {
  export const Layout = WidgetLayout;
  export const useAmzWidgetBox = innerUseAmzWidgetBox;
  export const useAmzWidget = innerUseAmzWidget;
}

export default AmzWidget;
