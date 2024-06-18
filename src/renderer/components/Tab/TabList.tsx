import { TabContext } from 'renderer/context/Alpha/TabContext';
import { Flex } from '../core';
import withTextAndIconButton from 'renderer/hoc/withTextAndIconButton';
import { PlusIcon } from '../Icons';
import { createRef, useCallback, useContext, useEffect } from 'react';
import Tab from './Tab';
import { WebViewOverride } from '../core/types';
import { Button, IconButton, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const NewTab = withTextAndIconButton(PlusIcon);

function TabList() {
  const { tabs, newTab } = useContext(TabContext);

  const createTab = useCallback(() => {
    const ref = createRef<WebViewOverride>();
    const tab: Tab = {
      keyword: '',
      webviewRef: ref,
    };
    newTab?.(tab);
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
