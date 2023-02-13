/*------------------------------------------------------------------------------------------------------------------------------------------
 * TopMenu.tsx
 * WRITER : 모시깽이
 * DATE : 20XX-XX-XX
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import { Button, DivisionBox, Icon } from 'module/AmzPack/component';
import React from 'react';

interface TopMenuProps {}

function TopMenu(props: TopMenuProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const {} = props;

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
        <Button.Round borderRadius={'50%'} width={'40px'} height={'40px'}>
          <Icon name="user" type="solid" />
        </Button.Round>
      </DivisionBox>
    </DivisionBox>
  );
}

namespace TopMenu {}

export default TopMenu;
