/*------------------------------------------------------------------------------------------------------------------------------------------
 * WithMenuLayout.tsx
 * WRITER : 최정근
 * DATE : 2022-12-19
 * DISCRIPTION : TopMenu가 포함된 Layout
 * TYPE : Layout
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import Menu from 'container/Menu';
import { IListInfo } from 'container/Menu/define';
import { DivisionBox, Icon } from 'module/AmzPack/component';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { menuInfo } from './const';

interface WithMenuLayoutProps {}

function WithMenuLayout(props: WithMenuLayoutProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;
  const navigate = useNavigate();

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <DivisionBox data-layout="withMenuLayout" template={'max-content auto'}>
      <div className="menu-area">
        <Menu
          id={'navigator'}
          title={'ERP'}
          listInfo={menuInfo.map((ele): IListInfo => {
            return {
              name: ele.name,
              icon: <Icon name={ele.icon.name} type={ele.icon.type} />,
              onClick: () => navigate(ele.uri),
            };
          })}
        />
      </div>
      <div className="contents-area">
        <Outlet />
      </div>
    </DivisionBox>
  );
}

namespace WithMenuLayout {}

export default WithMenuLayout;
