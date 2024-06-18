import { useCallback, useContext, useEffect, useState } from 'react';
import { SidebarToggleContext } from 'renderer/context/Alpha/SidebarToggleContext';
import { TabContext } from 'renderer/context/Alpha/TabContext';
import WebviewWrapper from '../WebviewWrapper';
import { Webview } from '../Webview';

type TabPanelProps = {
  index: number;
};

function TabPanel({ index }: TabPanelProps) {
  const { tabs, tabIndex } = useContext(TabContext);
  const { isOpen } = useContext(SidebarToggleContext);
  const [isReady, setReady] = useState<boolean>(false);

  const currentTab = tabs?.[index];

  useEffect(() => {
    const ready = () => {
      setReady(!isReady);
    };
    tabs?.[index]?.webviewRef?.current?.addEventListener('dom-ready', ready);

    return () => {
      tabs?.[index]?.webviewRef?.current?.removeEventListener(
        'dom-ready',
        ready
      );
    };
  }, [tabs?.[index]?.webviewRef]);

  const passive = useCallback(() => {
    return index !== tabIndex && isReady;
  }, [index, tabIndex, isReady]);

  const url = `https://www.google.com/search?q=${currentTab?.keyword}`;

  return (
    <div
      className={`webview-wrapper rounded-md w-full h-[calc(100vh-70px)] ${
        passive() ? 'hidden' : 'block'
      }  `}
    >
      <Webview url={url} viewRef={tabs?.[index]?.webviewRef ?? null} />
    </div>
  );
}

export default TabPanel;
