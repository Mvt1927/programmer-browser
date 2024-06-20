import { TabContext } from 'renderer/context/Alpha/TabContext';
import { createRef, useCallback, useContext, useEffect } from 'react';
import Tab from './Tab';
import { WebViewOverride } from '../core/types';
import { Button, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { ActionContext } from 'renderer/context/Alpha/ActionContext';
import { SidebarToggleContext } from 'renderer/context/Alpha/SidebarToggleContext';

function TabList() {
  const { tabs } = useContext(TabContext);

  const { setIsOpen } = useContext(SidebarToggleContext);

  const { createTabAction } = useContext(ActionContext);

  const createTab = useCallback(() => {
    createTabAction?.();
    setIsOpen?.off?.();
  }, []);

  useEffect(() => {
    tabs?.map((tab) => {
      tab?.webviewRef?.current?.addEventListener('page-title-updated', () => {
        console.log('page title updated!');
      });
    });
  }, [tabs]);

  return (
    <Stack direction="column" mb="4">
      {tabs?.map((_, i) => (
        <Tab key={i} index={i} />
      ))}

      <Button leftIcon={<AddIcon />} onClick={createTab}>
        New Tab
      </Button>
    </Stack>
  );
}
export default TabList;
