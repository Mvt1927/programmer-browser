import Sidebar from 'renderer/components/Sidebar/Sidebar';
import Main from './Main';
import Titlebar from 'renderer/components/Titlebar';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import { AllContextProvider } from 'renderer/context/Alpha/AllContext';

// 2. Add your color mode config

function Alpha() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden rounded-md">
      <ChakraProvider>
        <DarkMode>
          <AllContextProvider>
            <Titlebar />
            <Sidebar />
            <Main />
          </AllContextProvider>
        </DarkMode>
      </ChakraProvider>
    </div>
  );
}

export default Alpha;
