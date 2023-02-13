/*------------------------------------------------------------------------------------------------------------------------------------------
 * TopMenu.tsx
 * WRITER : 모시깽이
 * DATE : 20XX-XX-XX
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import React from 'react';
import { DivisionBox, Icon } from 'module/AmzPack/component';
import { useRecoilValue } from 'recoil';
import { TopMenuStateSelector } from './store/selector';
import { Button } from 'antd';

interface TopMenuProps {
  id: string;
}

function TopMenu(props: TopMenuProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { id } = props;
  const loginCond = useRecoilValue(TopMenuStateSelector.loginCondSelector(id));

  /* ―――――――――――――――― Method ―――――――――――――――― */

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <DivisionBox data-container="topMenu" template={'max-content auto max-content'}>
      <DivisionBox className="logo-area" horizonAlign={'center'} verticalAlign={'center'}>
        <em>ERP</em>
      </DivisionBox>
      <div></div>
      <DivisionBox className="info-area" template={'max-content'} verticalAlign={'center'} repeat>
        {/* 로그인 상태 ? 로그인 이후 상태 : 로그인 이전 상태 */}
        {loginCond ? (
          <DivisionBox className="info-box" template={'max-content'} gap={16} repeat>
            <Button shape="circle" icon={<Icon name="search" type="solid" />} />
            <Button shape="circle" icon={<Icon name="bell" type="regular" />} />
            <Button shape="circle" icon={<Icon name="user" type="regular" />} />
          </DivisionBox>
        ) : (
          <DivisionBox className="info-box" template={'max-content'} gap={16} repeat>
            <Button type="text">로그인</Button>
            <Button type="primary">회원가입</Button>
          </DivisionBox>
        )}
      </DivisionBox>
    </DivisionBox>
  );
}

namespace TopMenu {}

export default TopMenu;
