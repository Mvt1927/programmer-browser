import { LeftArrow, RefreshIcon, RightArrow } from '../Icons';
import { createRef, useCallback, useContext, useState } from 'react';
import { Tab, TabContext } from 'renderer/context/Alpha/TabContext';
import { SidebarToggleContext } from 'renderer/context/Alpha/SidebarToggleContext';
const { ipcRenderer } = window.require('electron');
import NoDragContainer from '../NoDragContainer';
import {
  ButtonGroup,
  DarkMode,
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
  CloseIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { WebViewOverride } from '../core/types';

function TabActions() {
  const createTab = () => {
    const ref = createRef<WebViewOverride>();
    const tab: Tab = {
      keyword: '',
      webviewRef: ref,
    };
    const index = newTab?.(tab);
    if (index !== undefined) {
      setSearchValue('');
      setTabIndex?.(index);
    }
  };

  const { toggle, isOpen } = useContext(SidebarToggleContext);

  const { tabIndex, setTabIndex, tabs, currentTab, newTab, search } =
    useContext(TabContext);

  const [searchValue, setSearchValue] = useState('');

  const back = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (currentTab?.webviewRef.current?.canGoBack())
      currentTab?.webviewRef.current.goBack();
  };

  const forward = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (currentTab?.webviewRef.current?.canGoForward())
      currentTab?.webviewRef.current?.goForward();
  };

  const refresh = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (currentTab?.webviewRef.current?.isLoading()) {
      currentTab?.webviewRef.current?.stop();
    } else {
      currentTab?.webviewRef.current?.reload();
    }
  };

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

  //   const url = () => {
  //     if (currentTab?.webviewRef?.current) {
  //       return currentTab?.webviewRef?.current.getURL();
  //     }
  //     return '';
  //   };
  const [isPinned, setIsPinned] = useState(false);

  // create new maximize state
  const [isMaximized, setIsMaximized] = useState(false);

  // toggle always on top
  const togglePin = () => {
    const newPinState = !isPinned;
    setIsPinned(newPinState);
    ipcRenderer.send('event-toggle-always-on-top', newPinState);
  };

  // hide window when clicking minimize
  const minimize = () => {
    ipcRenderer.send('event-minimize');
  };

  // toggle maximize window when clicking maximize
  const maximize = () => {
    const newMaximizeState = !isMaximized;
    setIsMaximized(newMaximizeState);
    ipcRenderer.send('event-toggle-maximize', newMaximizeState);

    //log the new maximize state
    console.log('maximize state: ', newMaximizeState);
  };

  // quit app when clicking close
  const close = () => {
    ipcRenderer.send('event-close');
  };

  // open new window
  const openNewWindow = () => {
    ipcRenderer.send('event-open-new-window');
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
                onClick={toggle}
                icon={<HamburgerIcon />}
              />
              <IconButton
                aria-label="back"
                onClick={back}
                icon={<LeftArrow />}
              />
              <IconButton
                aria-label="forward"
                onClick={forward}
                icon={<RightArrow />}
              />
              <IconButton
                aria-label="refresh"
                onClick={refresh}
                icon={<RefreshIcon />}
              />
            </ButtonGroup>
          </div>
          <Input
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
                    onClick={createTab}
                  >
                    New Tab
                  </MenuItem>
                  <MenuItem
                    icon={<ExternalLinkIcon />}
                    command="Ctrl+N"
                    color={'white'}
                    onClick={openNewWindow}
                    isDisabled={true}
                  >
                    New Window
                  </MenuItem>
                  <MenuItem
                    icon={<RepeatIcon />}
                    command="Ctrl+⇧T"
                    color={'white'}
                  >
                    Open Closed Tab
                  </MenuItem>
                  <MenuItem
                    icon={<EditIcon />}
                    command="Ctrl+O"
                    color={'white'}
                    onClick={togglePin}
                  >
                    Toggle Pin To Top
                  </MenuItem>
                </MenuList>
              </Menu>
              <IconButton
                aria-label="minimize"
                icon={<VscChromeMinimize />}
                onClick={minimize}
              ></IconButton>
              <IconButton
                aria-label="maximize or restore"
                icon={
                  isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />
                }
                onClick={maximize}
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
