/*------------------------------------------------------------------------------------------------------------------------------------------
 * ERPDesign.tsx
 * WRITER : 최정근
 * DATE : 2023-02-15
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import { DivisionBox } from 'module/AmzPack/component';
import { IChildren, IDataPage } from 'module/AmzPack/interface';
import React from 'react';

interface ERPDesignProps extends IChildren, IDataPage {}
function ERPDesign(props: ERPDesignProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { 'data-page': dataPage, children } = props;

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <div data-page={dataPage} data-container="erpDesign">
      {children}
    </div>
  );
}

namespace ERPDesign {
  interface ConditionArea extends IChildren {
    size: number | string;
  }
  export function ConditionArea(props: ConditionArea) {
    const { size, children } = props;

    function makeTemplate() {
      if (typeof size === 'number') return `repeat(${size}, max-content 1fr)`;
      else {
        let split = size.split(' ');
        let t = '';
        split.map((ele, idx) => {
          t += `max-content ${ele}`;
          if (split.length !== idx + 1) {
            t += ' ';
          }
        });
        return t;
      }
    }

    return (
      <DivisionBox data-container="erpDesign.ConditionArea" template={makeTemplate()} verticalAlign={'center'} gap={10}>
        {children}
      </DivisionBox>
    );
  }

  interface ConditionProps extends IChildren {
    title: string;
  }
  export function Condition(props: ConditionProps) {
    const { title, children } = props;
    return (
      <>
        <span className="label-box">
          <em>{title}</em>
        </span>
        <span className="component-box">{children}</span>
      </>
    );
  }
}

export default ERPDesign;
