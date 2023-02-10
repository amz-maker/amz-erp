/*------------------------------------------------------------------------------------------------------------------------------------------
 * Menu.tsx
 * WRITER : 최정근
 * DATE : 2022-11-11
 * DISCRIPTION : 
 * TYPE : Container
 * 개정이력 :
--------------------------------------------------------------------------------------------------------------------------------------------*/
import classNames from 'classnames';
import { Button, DivisionBox, Icon } from 'module/AmzPack/component';
import { useTest, useToggle } from 'module/AmzPack/hook';
import { useRecoilState } from 'recoil';
import { IListInfo } from './define';
import { ISideMenuStateId } from './store/atom';
import { SideMenuStateSelector } from './store/selector';

interface SideMenuProps {
  id: ISideMenuStateId;
  listInfo: IListInfo[];
}
export function SideMenu(props: SideMenuProps) {
  /* ――――――――――――――― Variable ――――――――――――――― */
  const { id, listInfo } = props;
  const { moduleName, naming, makeName } = useTest('sideMenu');
  const [miniMode, toggleMiniMode] = useToggle(true);

  /* ―――――――――――――――― Method ―――――――――――――――― */
  function printList() {
    return listInfo.map((ele, idx) => {
      const key = makeName('li', idx);
      return <SideMenu.List key={key} id={id} idx={idx} info={ele} miniMode={miniMode} />;
    });
  }

  /* ―――――――――――――― Use Effect ―――――――――――――― */

  /* ―――――――――――――――― Return ―――――――――――――――― */
  return (
    <DivisionBox
      className={classNames({ mini: miniMode })}
      data-container={moduleName}
      direction="VERTICAL"
      template={'max-content auto'}
      {...naming()}
    >
      <DivisionBox className="toggle-area" verticalAlign={'center'} horizonAlign={'center'}>
        <Button className="toggle-button" onClick={toggleMiniMode}>
          {miniMode ? <Icon className="icon" name="chevron-right" type="solid" /> : <Icon className="icon" name="chevron-left" type="solid" />}
        </Button>
      </DivisionBox>
      <div className="list-area">
        <ul>{printList()}</ul>
      </div>
    </DivisionBox>
  );
}

export namespace SideMenu {
  interface ListProps {
    id: ISideMenuStateId;
    idx: number;
    info: IListInfo;
    miniMode: boolean;
  }
  export function List(props: ListProps) {
    const { id, idx, info, miniMode } = props;
    const { moduleName, naming } = useTest('sideMenu.list');
    const [mode, setMode] = useRecoilState(SideMenuStateSelector.modeSelector(id));

    return (
      <li
        data-container={moduleName}
        onClick={() => {
          setMode(idx);
          info.onClick && info.onClick();
        }}
        className={classNames({ selected: mode === idx })}
        {...naming('li', idx)}
      >
        <DivisionBox className={classNames('list-wrapper', { mini: miniMode })} template="max-content auto" verticalAlign={'center'}>
          <span className="icon-box">{info.icon}</span>
          <span className="name-box">
            <em>{info.name}</em>
          </span>
        </DivisionBox>
      </li>
    );
  }
}

export default SideMenu;
