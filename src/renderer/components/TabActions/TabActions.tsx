import { LeftArrow, RefreshIcon, RightArrow } from '../Icons';
import { useContext, useState } from 'react';
import { TabContext } from 'renderer/context/Alpha/TabContext';
import { SidebarToggleContext } from 'renderer/context/Alpha/SidebarToggleContext';
import NoDragContainer from '../NoDragContainer';
import {
  ButtonGroup,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
  VscSettingsGear,
} from 'react-icons/vsc';
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import { ActionContext } from 'renderer/context/Alpha/ActionContext';

function TabActions() {
  const { setIsOpen: setSidebarIsOpen } = useContext(SidebarToggleContext);

  const { search, restoreLastTab } = useContext(TabContext);

  // import ActionContext
  const {
    createTabAction,
    backAction,
    forwardAction,
    isPinToTop,
    pinToTopAction,
    reloadActon,
    minimizeAction,
    isMaximized,
    maximizeAction,
    openNewWindowAction,
    searchRef,
  } = useContext(ActionContext);

  const [searchValue, setSearchValue] = useState('');

  const onChange = (event: any) => {
    setSearchValue(event.currentTarget.value);
  };

  const onKeydown = (event: any) => {
    if (event.key === 'Enter') {
      console.log('search input: ', searchValue);
      console.warn('pressed enter key');
      search?.(searchValue);
    }
  };

  return (
    <div className="m-2 w-full h-full">
      <div className="w-full flex justify-center items-center">
        <NoDragContainer width="100%">
          <div className="mr-2">
            <ButtonGroup isAttached>
              <IconButton
                className="hidden sm:block"
                aria-label="menu"
                onClick={setSidebarIsOpen?.toggle}
                icon={<HamburgerIcon />}
              />
              <IconButton
                aria-label="back"
                onClick={backAction}
                icon={<LeftArrow />}
              />
              <IconButton
                aria-label="forward"
                onClick={forwardAction}
                icon={<RightArrow />}
              />
              <IconButton
                aria-label="refresh"
                onClick={reloadActon}
                icon={<RefreshIcon />}
              />
            </ButtonGroup>
          </div>
          <Input
            ref={searchRef}
            className=""
            variant={'filled'}
            color={'white'}
            placeholder="Search"
            onChange={onChange}
            onKeyDown={onKeydown}
            value={searchValue}
          />
          <div className="ml-2">
            <ButtonGroup isAttached>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<VscSettingsGear />}
                />
                <MenuList zIndex={10}>
                  <MenuItem
                    icon={<AddIcon />}
                    command="Ctrl+T"
                    color={'white'}
                    onClick={() => {
                      createTabAction?.(setSearchValue);
                    }}
                  >
                    New Tab
                  </MenuItem>
                  <MenuItem
                    icon={<ExternalLinkIcon />}
                    command="Ctrl+N"
                    color={'white'}
                    onClick={openNewWindowAction}
                    isDisabled={true}
                  >
                    New Window
                  </MenuItem>
                  <MenuItem
                    icon={<RepeatIcon />}
                    command="Ctrl+⇧T"
                    color={'white'}
                    onClick={restoreLastTab}
                  >
                    Open Closed Tab
                  </MenuItem>
                  <MenuItem
                    icon={<EditIcon />}
                    command="Ctrl+O"
                    color={'white'}
                    onClick={pinToTopAction}
                    backgroundColor={isPinToTop ? 'Highlight' : ''}
                  >
                    Turn {isPinToTop ? 'Off' : 'On'} Pin To Top
                  </MenuItem>
                </MenuList>
              </Menu>
              <IconButton
                aria-label="minimize"
                icon={<VscChromeMinimize />}
                onClick={minimizeAction}
              ></IconButton>
              <IconButton
                aria-label="maximize or restore"
                icon={
                  isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />
                }
                onClick={maximizeAction}
              ></IconButton>
              <IconButton
                aria-label="close"
                _hover={{ backgroundColor: 'red' }}
                icon={<VscChromeClose />}
                onClick={close}
              ></IconButton>
            </ButtonGroup>
          </div>
        </NoDragContainer>
      </div>
    </div>
  );
}

export default TabActions;
