/*------------------------------------------------------------------------------------------------------------------------------------------
 * Checkbox.tsx
 * WRITER : 최정근
 * DATE : 2022-12-19
 * DISCRIPTION : 체크박스
 * TYPE : Component
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import classNames, { Value } from 'classnames';
import { useTest, useAmzComponent } from '../../hook';

type ValueType = string | number | boolean;
type Variation = 'BUTTON';

/*====================
  VARIATION
====================*/
const variationCreator = useAmzComponent.makeVariationCreator<ValueType, Variation, IStyledProps, CheckboxCoreProps>(CheckboxCore);

// Variation - Button
interface CheckboxButtonProps {}
const CheckboxButton = variationCreator.build<CheckboxButtonProps, ValueType>((props) => {
  return {
    ...props,
    variation: 'BUTTON',
    defaultValue: props.defaultValue ?? 0,
  } as CheckboxCoreProps;
});

/*====================
  Default
====================*/
interface CheckboxProps<T extends ValueType> extends useAmzComponent.IComponent<T>, IStyledProps {}
function Checkbox<T extends ValueType>(props: CheckboxProps<T>) {
  return <CheckboxCore {...(props as CheckboxCoreProps)} />;
}

/*====================
  CORE
====================*/
interface CheckboxCoreProps extends useAmzComponent.IComponentCore<Variation, ValueType>, IStyledProps {}
export function CheckboxCore(props: CheckboxCoreProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { variation, viewComponent, defaultValue = '' } = props;
  const [data, setData] = useAmzComponent<ValueType>({
    ...props,
    defaultValue,
  });

  const viewProps: CheckboxViewProps = {
    ...props,
    value: data,
    onChange: (e) => setData(e.target.value),
  };
  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return useAmzComponent.selectView(
    variation,
    viewProps,
    viewComponent,
    <CheckboxView {...viewProps} />,
    { variation: 'NUMBER', component: <CheckboxView {...viewProps} /> },
    { variation: 'PASSWORD', component: <CheckboxView {...viewProps} /> },
  );
}

/*====================
  VIEW
====================*/
interface IStyledProps {
  design?: 'default' | 'text';
  placeholder?: string;
}
export interface CheckboxViewProps extends useAmzComponent.IComponentView<Variation>, IStyledProps {
  value: ValueType | any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function CheckboxView(props: CheckboxViewProps) {
  const { moduleName, naming } = useTest('input');
  const { variation, placeholder = '', className, design = 'default', value, onChange } = props;

  return (
    <div data-component={moduleName} data-variation={variation} {...naming()}>
      <div className={classNames('input-box', className, design)}>
        <input placeholder={placeholder} type="checkbox" value={value} onChange={onChange} {...naming('core')} />
      </div>
    </div>
  );
}

/*====================
  NAMESPACE
====================*/
namespace Input {
  export const Button = CheckboxButton;
}

export default Input;
