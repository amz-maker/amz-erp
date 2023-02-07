/*------------------------------------------------------------------------------------------------------------------------------------------
 * [FTName | capitalize].tsx
 * WRITER : 모시깽이
 * DATE : 20XX-XX-XX
 * DISCRIPTION : 
 * TYPE : Component
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import classNames from 'classnames';
import { useTest, useAmzComponent } from '../../hook';

type ValueType = string | number;
type Variation = 'SOME_TYPE';

/*====================
  VARIATION
====================*/
const variationCreator = useAmzComponent.makeVariationCreator<ValueType, Variation, IStyledProps, <FTName | capitalize>CoreProps>(<FTName | capitalize>Core);

// Variation - TYPE
interface <FTName | capitalize>SomeTypeProps {}
const <FTName | capitalize>SomeType = variationCreator.build<<FTName | capitalize>SomeTypeProps, number>((props) => {
  return {
    ...props,
    variation: 'SOME_TYPE',
    defaultValue: props.defaultValue ?? 0,
  } as <FTName | capitalize>CoreProps;
});

/*====================
  DEFAULT
====================*/
interface <FTName | capitalize>Props extends useAmzComponent.IComponent<ValueType>, IStyledProps {}
function <FTName | capitalize>(props: <FTName | capitalize>Props) {
  return <<FTName | capitalize>Core {...props} />;
}

/*====================
  CORE
====================*/
interface <FTName | capitalize>CoreProps extends useAmzComponent.IComponentCore<Variation, ValueType>, IStyledProps {}
export function <FTName | capitalize>Core(props: <FTName | capitalize>CoreProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { variation, viewComponent, defaultValue = '' } = props;
  const [data, setData] = useAmzComponent<ValueType>({
    ...props,
    defaultValue,
  });

  const viewProps: <FTName | capitalize>ViewProps = {
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
    <<FTName | capitalize>View {...viewProps} />,
    { variation: 'SOME_TYPE', component: <<FTName | capitalize>View {...viewProps} /> },
  );
}

/*====================
  VIEW
====================*/
interface IStyledProps {
  bordered?: boolean;
}
export interface <FTName | capitalize>ViewProps extends useAmzComponent.IComponentView, IStyledProps {
  value: ValueType;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function <FTName | capitalize>View(props: <FTName | capitalize>ViewProps) {
  const { moduleName, naming } = useTest('[FTName | camelcase]');
  const { value, onChange, bordered = true } = props;

  return (
    <div data-component={moduleName} {...naming()}>
      <input type="text" className={classNames({ bordered: bordered })} value={value} onChange={onChange} {...naming('core')} />
    </div>
  );
}

/*====================
  NAMESPACE
====================*/
namespace <FTName | capitalize> {};

export default <FTName | capitalize>;