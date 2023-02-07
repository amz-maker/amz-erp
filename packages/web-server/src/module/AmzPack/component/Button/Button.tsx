/*------------------------------------------------------------------------------------------------------------------------------------------
 * Button.tsx
 * WRITER : 모시깽이
 * DATE : 2022-11-16
 * DISCRIPTION : 
 * TYPE : Component
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import classNames from 'classnames';
import { useTest, useAmzComponent } from '../../hook';

type Variation = 'SOME_TYPE';

/*====================
  VARIATION
====================*/

/*====================
  DEFAULT
====================*/
interface ButtonProps extends useAmzComponent.IComponentMinimal, IStyledProps {}
function Button(props: ButtonProps) {
  return <ButtonCore {...props} />;
}

/*====================
  CORE
====================*/
interface ButtonCoreProps extends useAmzComponent.IComponentCoreMinimal<Variation>, IStyledProps {}
export function ButtonCore(props: ButtonCoreProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { variation, viewComponent } = props;

  const viewProps: ButtonViewProps = {
    ...props,
  };
  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return useAmzComponent.selectView(variation, viewProps, viewComponent, <ButtonView {...viewProps} />, {
    variation: 'SOME_TYPE',
    component: <ButtonView {...viewProps} />,
  });
}

/*====================
  VIEW
====================*/
interface IStyledProps {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  design?: 'default' | 'dashed' | 'text';
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}
export interface ButtonViewProps extends useAmzComponent.IComponentView, IStyledProps {}
function ButtonView(props: ButtonViewProps) {
  const { onClick, className, children } = props;
  const { moduleName, naming } = useTest('button');
  const { type = 'button', design = 'default' } = props;

  return (
    <button data-component={moduleName} {...naming()} onClick={onClick} type={type} className={classNames(className, design)}>
      {children}
    </button>
  );
}

/*====================
  NAMESPACE
====================*/
namespace Button {}

export default Button;
