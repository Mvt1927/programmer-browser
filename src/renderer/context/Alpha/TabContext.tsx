import { createContext, useEffect, useState } from 'react';
import { WebViewOverride } from 'renderer/components/core/types';

export type Tab = {
  keyword: string;
  webviewRef: React.RefObject<WebViewOverride>;
};

type TabContextProps = {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  tabs: Tab[];
  currentTab: Tab;
  newTab: (tab: Tab) => number;
  search: (value: string) => void;
  removeTab: (index: number) => void;
};

type TabContextProviderProps = {
  children: React.ReactNode;
};

export const TabContext = createContext<Partial<TabContextProps>>({});

export function TabContextProvider({ children }: TabContextProviderProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [tabs, setTabs] = useState<Tab[]>([]);
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
    const updatedTabs = tabs?.filter((tab, idx) => idx !== index);
    setTabs([...updatedTabs]);
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
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
