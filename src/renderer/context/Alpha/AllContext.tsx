// add all prooviders here

import React from 'react';
import { ActionContextProvider } from './ActionContext';
import { SidebarToggleProvider } from './SidebarToggleContext';
import { TabContextProvider } from './TabContext';
import { HotkeysProvider } from 'react-hotkeys-hook';

type AllContextProps = {
  children: React.ReactNode;
};

export function AllContextProvider({ children }: AllContextProps) {
  return (
    <HotkeysProvider>
      <TabContextProvider>
        <SidebarToggleProvider>
          <ActionContextProvider>{children}</ActionContextProvider>
        </SidebarToggleProvider>
      </TabContextProvider>
    </HotkeysProvider>
  );
}
