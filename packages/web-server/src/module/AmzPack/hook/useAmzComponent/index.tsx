/*------------------------------------------------------------------------------------------------------------------------------------------
 * UseComponent.tsx
 * WRITER : 최정근
 * DATE : 2022-11-04
 * DISCRIPTION : AMZ Component를 만들기 위한 가이드라인 서포터
 * TYPE : Hook
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import AmzForm from '../../component/AmzForm';
import { AmzDataType } from '../useAmzForm';
import Util from '../../util';
import lodash from 'lodash';
import { IChildren } from 'module/AmzPack/interface';

type ComponentCommonType<V> = {
  className?: string;
  value?: V;
  onChange?: (value: V) => void;
  namePath?: string;
};

type ComponentMinimalType = {
  className?: string;
};

type DefaultValueType<V> = {
  defaultValue: V;
};

type ComponentCoreCommonType<VARIATION extends string> = {
  variation?: VARIATION | (string & Record<never, never>);
  viewComponent?: React.ReactNode;
};

function useWrapedContext<V>(namePath: string = '', sync: (v: V | undefined) => void) {
  const [data, _setData, _getData, clear, subscribe, unsubscribe] = React.useContext<AmzDataType<Record<string, any>>>(AmzForm.context);

  function setData(v: V | undefined) {
    let d = getData();
    if (d !== undefined && !lodash.isEqual(v, d)) {
      _setData('FIND', [{ namePath: namePath, value: v }]);
    }
  }

  function getData() {
    return _getData(namePath);
  }

  React.useEffect(() => {
    subscribe(namePath, sync);

    return () => {
      unsubscribe(namePath, sync);
    };
  }, []);

  return [data, setData, getData, clear] as const;
}

function useWrappedState<V>(
  defaultValue: V | undefined,
  sync: (v: V | undefined) => void,
): [V | undefined, React.Dispatch<React.SetStateAction<V | undefined>>, React.Dispatch<React.SetStateAction<V | undefined>>] {
  const [state, _setState] = React.useState<V | undefined>(defaultValue);

  const setState: React.Dispatch<React.SetStateAction<V | undefined>> = React.useCallback(
    (v) => {
      _setState(v);

      let _v: V | undefined;

      if (v instanceof Function) {
        _v = v(state);
      } else {
        _v = v;
      }

      sync(_v);
    },
    [state],
  );
  return [state, _setState, setState];
}

function useAmzComponent<V>(p: ComponentCommonType<V>): [V | undefined, React.Dispatch<React.SetStateAction<V | undefined>>];
function useAmzComponent<V>(p: ComponentCommonType<V> & DefaultValueType<V>): [V, React.Dispatch<React.SetStateAction<V>>];
function useAmzComponent<V>(p: useAmzComponent.IComponent<V>): any {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { defaultValue, value, onChange, namePath } = p;
  const [, setData] = useWrapedContext<V>(namePath, (v) => {
    setState(v);
    setValue(v);
  });
  const [state, setState, setStateSync] = useWrappedState<V>(defaultValue, (v) => {
    setValue(v);
    setData(v);
  });
  /* ―――――――――――――――― Method ―――――――――――――――― */
  function setValue(v: V | undefined) {
    if (onChange !== undefined && v !== undefined && !lodash.isEqual(v, value)) {
      onChange(v);
    }
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */
  // value is changed
  React.useEffect(() => {
    setState(value);
    setData(value);
  }, [value]);

  // set default
  React.useEffect(() => {
    setState(defaultValue);
  }, []);

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return [state, setStateSync];
}

namespace useAmzComponent {
  export interface IComponent<V> extends ComponentCommonType<V>, Partial<DefaultValueType<V>>, IChildren {}
  export interface IComponentMinimal extends ComponentMinimalType, IChildren {}

  export interface IComponentCore<VARIATION extends string, V> extends ComponentCoreCommonType<VARIATION>, IComponent<V>, IChildren {}
  export interface IComponentCoreMinimal<VARIATION extends string> extends ComponentCoreCommonType<VARIATION>, IComponentMinimal, IChildren {}

  export interface IComponentView<VARIATION extends string> extends IChildren {
    className?: string;
    variation?: VARIATION | (string & Record<never, never>);
  }

  export function makeVariationCreator<
    VALUE_TYPE,
    VARIATION extends string,
    STYLED_PROPS extends object,
    CORE_PROPS extends useAmzComponent.IComponentCore<VARIATION, VALUE_TYPE> & STYLED_PROPS,
  >(core: (props: CORE_PROPS) => JSX.Element) {
    return {
      build<P extends object, V extends VALUE_TYPE, PE = P & Omit<useAmzComponent.IComponent<V>, keyof P> & Omit<STYLED_PROPS, keyof P>>(
        handler: (props: PE) => CORE_PROPS,
      ) {
        return (props: PE) => {
          const CoreComponent = core;
          return <CoreComponent {...(handler(props) as CORE_PROPS)} />;
        };
      },
    };
  }

  export function makeVariationCreatorMinimal<
    VARIATION extends string,
    STYLED_PROPS extends object,
    CORE_PROPS extends useAmzComponent.IComponentCoreMinimal<VARIATION> & STYLED_PROPS,
  >(core: (props: CORE_PROPS) => JSX.Element) {
    return {
      build<P extends object, PE = P & Omit<useAmzComponent.IComponentMinimal, keyof P> & Omit<STYLED_PROPS, keyof P>>(
        handler: (props: PE) => CORE_PROPS,
      ) {
        return (props: PE) => {
          const CoreComponent = core;
          return <CoreComponent {...(handler(props) as CORE_PROPS)} />;
        };
      },
    };
  }

  export function selectView<T extends string>(
    variation: T | undefined,
    viewProps: object,
    outerViewComponent: React.ReactNode,
    defaultViewComponent: React.ReactNode,
    ...viewList: { variation: T; component: React.ReactNode }[]
  ) {
    let resultViewComp: React.ReactElement | undefined = outerViewComponent as React.ReactElement;

    if (Util.is.undefData(outerViewComponent)) {
      for (let view of viewList) {
        if (variation === view.variation) {
          resultViewComp = view.component as React.ReactElement;
          break;
        }
      }
    }

    if (Util.is.undefData(resultViewComp)) {
      resultViewComp = defaultViewComponent as React.ReactElement;
    }

    if (React.isValidElement(resultViewComp)) {
      return React.cloneElement(resultViewComp, { ...viewProps });
    } else {
      return resultViewComp;
    }
  }
}

export { useAmzComponent };
