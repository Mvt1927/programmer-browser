import React, { createContext, useEffect, useState } from 'react';
import { WebViewOverride } from 'renderer/components/core/types';

export type Tab = {
  keyword: string;
  webviewRef: React.RefObject<WebViewOverride>;
  icon?: string;
};

type TabContextProps = {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  tabs: Tab[];
  trashTabs: Tab[];
  currentTab: Tab;
  newTab: (tab: Tab) => number;
  search: (value: string) => void;
  removeTab: (index: number) => void;
  restoreTab: (index: number) => void;
  restoreLastTab: () => void;
  clearTrashTabs: () => void;
  clearTabs: () => void;
  clearAll: () => void;
};

type TabContextProviderProps = {
  children: React.ReactNode;
};

export const TabContext = createContext<Partial<TabContextProps>>({});

export function TabContextProvider({ children }: TabContextProviderProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [trashTabs, setTrashTabs] = useState<Tab[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[tabIndex]);

  // Sekme indexi degistiginde aktif sekme degisecek.
  useEffect(() => {
    setCurrentTab(tabs[tabIndex]);
  }, [tabIndex]);

  useEffect(() => {
    console.warn('Current Tab Index: ', tabIndex);
  }, [currentTab]);

  // Yeni sekme ekleme
  function newTab(tab: Tab): number {
    setTabs([...tabs, tab]);
    return tabs.length;
  }

  function removeTab(index: number): void {
    const removedTab = tabs?.filter((tab, idx) => idx === index);
    const updatedTabs = tabs?.filter((tab, idx) => idx !== index);

    setTrashTabs([...trashTabs, ...removedTab]);
    setTabs([...updatedTabs]);
  }

  function restoreTab(index: number): void {
    const restoredTab = trashTabs?.filter((tab, idx) => idx === index);
    const updatedTrashTabs = trashTabs?.filter((tab, idx) => idx !== index);

    setTabs([...tabs, ...restoredTab]);
    setTrashTabs([...updatedTrashTabs]);
  }

  function restoreLastTab(): void {
    const lastTab = trashTabs?.pop();
    if (lastTab !== undefined) {
      setTabs([...tabs, lastTab]);
    }
  }

  function clearTrashTabs(): void {
    setTrashTabs([]);
  }

  function clearTabs(): void {
    setTabs([]);
  }

  function clearAll(): void {
    clearTabs();
    clearTrashTabs();
  }

  function search(value: string): void {
    //! Problem: Current Tab'i guncelliyorum ancak, tabs icindeki indexteki tab'i guncellemiyorum.

    const updatedTabs = tabs?.map((tab, index) => {
      if (index === tabIndex) {
        return {
          keyword: value,
          webviewRef: tab?.webviewRef,
        };
      }
      return tab;
    });

    setTabs(updatedTabs);

    setCurrentTab({
      keyword: value,
      webviewRef: currentTab?.webviewRef,
    });
  }

  return (
    <TabContext.Provider
      value={{
        tabIndex,
        setTabIndex,
        tabs,
        currentTab,
        newTab,
        search,
        removeTab,
        restoreTab,
        restoreLastTab,
        clearTabs,
        clearTrashTabs,
        clearAll,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
