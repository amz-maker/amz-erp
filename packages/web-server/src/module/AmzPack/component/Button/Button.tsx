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

type Variation = 'ROUND';

/*====================
  VARIATION
====================*/
const variationCreator = useAmzComponent.makeVariationCreatorMinimal<Variation, IStyledProps, ButtonCoreProps>(ButtonCore);

// Variation - Round
interface ButtonRoundProps {
  borderRadius: React.CSSProperties['borderRadius'];
}
const ButtonRound = variationCreator.build<ButtonRoundProps>((props) => {
  return {
    ...props,
    variation: 'ROUND',
  } as ButtonCoreProps;
});

/*====================
  DEFAULT
====================*/
interface ButtonProps extends useAmzComponent.IComponentMinimal, IStyledProps {}
function Button(props: ButtonProps) {
  return <ButtonCore variation={'DEFAULT'} {...props} />;
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
    variation: 'ROUND',
    component: <ButtonView {...viewProps} />,
  });
}

/*====================
  VIEW
====================*/
interface IStyledProps {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  borderRadius?: React.CSSProperties['borderRadius'];
  borderStyle?: React.CSSProperties['borderStyle'];
  borderWidth?: React.CSSProperties['borderWidth'];
  borderColor?: React.CSSProperties['borderColor'];
  design?: 'default' | 'dashed' | 'text';
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}
export interface ButtonViewProps extends useAmzComponent.IComponentView<Variation>, IStyledProps {}
function ButtonView(props: ButtonViewProps) {
  const { moduleName, naming } = useTest('button');
  const { variation, onClick, className, children, type = 'button', design = 'default' } = props;

  return (
    <button
      data-component={moduleName}
      data-variation={variation}
      {...naming()}
      onClick={onClick}
      type={type}
      className={classNames(className, design)}
      style={{ ...props }}
    >
      {children}
    </button>
  );
}

/*====================
  NAMESPACE
====================*/
namespace Button {
  export const Round = ButtonRound;
}

export default Button;
