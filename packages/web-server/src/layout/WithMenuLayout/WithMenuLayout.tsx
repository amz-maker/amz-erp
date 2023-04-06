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
import { SideMenuStateSelector } from 'container/SideMenu/store/selector';
import TopMenu from 'container/TopMenu';
import { DivisionBox, Icon } from 'module/AmzPack/component';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { menuInfo } from './const';

interface WithMenuLayoutProps {}

function WithMenuLayout(props: WithMenuLayoutProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;
  const navigate = useNavigate();
  const mode = useRecoilValue(SideMenuStateSelector.modeSelector('sideMenu'));

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <DivisionBox
      data-layout="withMenuLayout"
      template={{
        row: '60px 1fr',
        col: 'max-content 1fr',
      }}
    >
      <DivisionBox.Span className="top-menu-area" colSpan={2}>
        <TopMenu id={'topMenu'} />
      </DivisionBox.Span>
      <div className="side-menu-area">
        <SideMenu
          id={'sideMenu'}
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
        <div className="contents-title">
          {menuInfo[mode].name}
        </div>
        <Outlet />
      </div>
    </DivisionBox>
  );
}

namespace WithMenuLayout {}

export default WithMenuLayout;
