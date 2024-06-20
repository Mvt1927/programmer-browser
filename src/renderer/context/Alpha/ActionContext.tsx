// create action context

import { createContext, createRef, useContext, useRef, useState } from 'react';
import { Tab, TabContext } from './TabContext';
import { useBoolean } from '@chakra-ui/react';
import { WebViewOverride } from 'renderer/components/core/types';

const { ipcRenderer } = window.require('electron');

type ActionContextProps = typeof props;

const props = {
  createTabAction: (
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>
  ) => {},
  backAction: () => {},
  forwardAction: () => {},
  isPinToTop: false,
  pinToTopAction: () => {},
  isReload: false,
  reloadActon: () => {},
  minimizeAction: () => {},
  isMaximized: false,
  maximizeAction: () => {},
  openNewWindowAction: () => {},
  closeAction: () => {},
  searchRef: createRef<HTMLInputElement>(),
};

export const ActionContext = createContext<Partial<ActionContextProps>>(props);

type ActionContextProviderProps = {
  children: React.ReactNode;
};

export function ActionContextProvider({
  children,
}: ActionContextProviderProps) {
  const [isPinToTop, setIsPinToTop] = useBoolean(false);
  const [isReload, setIsReload] = useBoolean(false);
  const [isMaximized, setIsMaximized] = useBoolean(false);

  const { setTabIndex, currentTab, newTab } = useContext(TabContext);

  const searchRef = createRef<HTMLInputElement>();

  const createTabAction = (
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const ref = createRef<WebViewOverride>();
    const tab: Tab = {
      keyword: '',
      webviewRef: ref,
    };
    const index = newTab?.(tab);
    if (index !== undefined) {
      setSearchValue?.('');
      setTabIndex?.(index);
      searchRef?.current?.focus();
    }
  };

  const backAction = () => {
    if (currentTab?.webviewRef.current?.canGoBack()) {
      currentTab?.webviewRef.current.goBack();
    } else {
      alert('No back history');
    }
  };

  const forwardAction = () => {
    if (currentTab?.webviewRef.current?.canGoForward()) {
      currentTab?.webviewRef.current.goForward();
    } else {
      alert('No forward history');
    }
  };

  const reloadActon = () => {
    console.log('reload action');
    setIsReload.on();
    if (currentTab?.webviewRef.current?.isLoading()) {
      currentTab?.webviewRef.current.stop();
      setIsReload.off();
    } else {
      if (currentTab?.webviewRef.current) {
        currentTab?.webviewRef.current.reload();
        currentTab?.webviewRef.current.addEventListener(
          'did-stop-loading',
          () => {
            setIsReload.off();
            currentTab?.webviewRef.current?.removeEventListener(
              'did-stop-loading',
              () => {}
            );
          }
        );
      }
    }
  };

  const pinToTopAction = () => {
    ipcRenderer.send('event-toggle-always-on-top', !isPinToTop);
    setIsPinToTop.toggle();
  };

  const minimizeAction = () => {
    ipcRenderer.send('event-minimize');
  };

  const maximizeAction = () => {
    ipcRenderer.send('event-toggle-maximize', !isMaximized);
    setIsMaximized.toggle();
  };

  const openNewWindowAction = () => {
    ipcRenderer.send('event-open-new-window');
  };

  const closeAction = () => {
    ipcRenderer.send('event-close');
  };

  return (
    <ActionContext.Provider
      value={{
        createTabAction,
        backAction,
        forwardAction,
        isPinToTop,
        pinToTopAction,
        isReload,
        reloadActon,
        minimizeAction,
        isMaximized,
        maximizeAction,
        openNewWindowAction,
        closeAction,
        searchRef,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
}
