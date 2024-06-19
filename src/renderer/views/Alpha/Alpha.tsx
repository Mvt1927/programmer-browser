import Sidebar from 'renderer/components/Sidebar/Sidebar';
import { TabContextProvider } from 'renderer/context/Alpha/TabContext';
import Main from './Main';
import Titlebar from 'renderer/components/Titlebar';
import { SidebarToggleProvider } from 'renderer/context/Alpha/SidebarToggleContext';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';

// 2. Add your color mode config

function Alpha() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden rounded-md">
      <ChakraProvider>
        <DarkMode>
          <TabContextProvider>
            <SidebarToggleProvider>
              <Titlebar />
              <Sidebar />
              <Main />
            </SidebarToggleProvider>
          </TabContextProvider>
        </DarkMode>
      </ChakraProvider>
    </div>
  );
}

export default Alpha;
