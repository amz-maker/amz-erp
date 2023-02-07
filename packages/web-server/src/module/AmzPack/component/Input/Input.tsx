/*------------------------------------------------------------------------------------------------------------------------------------------
 * Input.tsx
 * WRITER : 최정근
 * DATE : 2022-11-08
 * DISCRIPTION : 
 * TYPE : Component
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import classNames, { Value } from 'classnames';
import { useTest, useAmzComponent } from '../../hook';

type ValueType = string | number;
type Variation = 'NUMBER' | 'PASSWORD';

/*====================
  VARIATION
====================*/
const variationCreator = useAmzComponent.makeVariationCreator<ValueType, Variation, IStyledProps, InputCoreProps>(InputCore);

// Variation - NUMBER
interface InputNumberProps {}
const InputNumber = variationCreator.build<InputNumberProps, number>((props) => {
  return {
    ...props,
    variation: 'NUMBER',
    defaultValue: props.defaultValue ?? 0,
  } as InputCoreProps;
});

// Variation - PASSWORD
interface InputPasswordProps {}
const InputPassword = variationCreator.build<InputPasswordProps, string>((props) => {
  return {
    ...props,
    variation: 'PASSWORD',
    defaultValue: props.defaultValue ?? '',
  } as InputCoreProps;
});

/*====================
  Default
====================*/
interface InputProps<T extends ValueType> extends useAmzComponent.IComponent<T>, IStyledProps {}
function Input<T extends ValueType>(props: InputProps<T>) {
  return <InputCore {...(props as InputCoreProps)} />;
}

/*====================
  CORE
====================*/
interface InputCoreProps extends useAmzComponent.IComponentCore<Variation, ValueType>, IStyledProps {}
export function InputCore(props: InputCoreProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { variation, viewComponent, defaultValue = '' } = props;
  const [data, setData] = useAmzComponent<ValueType>({
    ...props,
    defaultValue,
  });

  const viewProps: InputViewProps = {
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
    <InputView {...viewProps} />,
    { variation: 'NUMBER', component: <InputView {...viewProps} /> },
    { variation: 'PASSWORD', component: <InputView {...viewProps} /> },
  );
}

/*====================
  VIEW
====================*/
interface IStyledProps {
  design?: 'default' | 'text';
  placeholder?: string;
}
export interface InputViewProps extends useAmzComponent.IComponentView, IStyledProps {
  value: ValueType;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function InputView(props: InputViewProps) {
  const { moduleName, naming } = useTest('input');
  const { placeholder = '', className, design = 'default', value, onChange } = props;

  return (
    <div data-component={moduleName} {...naming()}>
      <div className={classNames('input-box', className, design)}>
        <input placeholder={placeholder} type="text" value={value} onChange={onChange} {...naming('core')} />
      </div>
    </div>
  );
}

/*====================
  NAMESPACE
====================*/
namespace Input {
  export const Number = InputNumber;
  export const Password = InputPassword;
}

export default Input;
