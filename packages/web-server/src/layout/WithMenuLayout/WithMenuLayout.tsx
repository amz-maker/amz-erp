/*------------------------------------------------------------------------------------------------------------------------------------------
 * WithMenuLayout.tsx
 * WRITER : 최정근
 * DATE : 2022-12-19
 * DISCRIPTION : SideMenu, TopMenu가 포함된 Layout
 * TYPE : Layout
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import SideMenu from 'container/SideMenu';
import { IListInfo } from 'container/SideMenu/define';
import TopMenu from 'container/TopMenu';
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
    <DivisionBox
      data-layout="withMenuLayout"
      template={{
        row: '60px auto',
        col: 'max-content auto',
      }}
    >
      <DivisionBox.Span className="span-box" colSpan={2}>
        <div className="top-menu-area">
          <TopMenu />
        </div>
      </DivisionBox.Span>
      <div className="side-menu-area">
        <SideMenu
          id={'navigator'}
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
