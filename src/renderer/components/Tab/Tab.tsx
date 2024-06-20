import { Tab, TabContext } from 'renderer/context/Alpha/TabContext';
import { useContext, useEffect, useState } from 'react';
import Favicon from '../Favicon';
import TabButton from './TabButton';
import TabText from './TabText';
import useTab from 'renderer/hooks/useTab';
import { Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import { CloseIcon, SmallCloseIcon } from '@chakra-ui/icons';

type TabProps = {
  index: number;
};

function Tab({ index }: TabProps) {
  const { setTabIndex, tabIndex, tabs, removeTab } = useContext(TabContext);

  const { title, favicon } = useTab({ index });

  // const [title, setTitle] = useState<string>('');
  // const [favicon, setFavicon] = useState<string>(
  //   'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=%27%27&size=64'
  // );

  const [isFaviconUpdated, setFaviconUpdated] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      setFaviconUpdated(!isFaviconUpdated);
    };
    tabs?.[index]?.webviewRef?.current?.addEventListener(
      'page-title-updated',
      update
    );

    return () => {
      tabs?.[index]?.webviewRef?.current?.removeEventListener(
        'page-title-updated',
        update
      );
    };
  }, []);

  // useEffect(() => {
  //   const update = () => {
  //     console.log('page-favicon-updated');

  //     if (tabs?.[index]?.webviewRef?.current) {
  //       setTitle(
  //         tabs?.[index]?.webviewRef?.current?.getTitle() ?? 'Loading...'
  //       );
  //       const url = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
  //         tabs?.[index]?.webviewRef?.current?.getURL() ?? ''
  //       }&size=64`;
  //       setFavicon(url);
  //     }
  //   };

  //   tabs?.[index]?.webviewRef?.current?.addEventListener('dom-ready', update);

  //   return () => {
  //     tabs?.[index]?.webviewRef?.current?.removeEventListener(
  //       'dom-ready',
  //       update
  //     );
  //   };
  // }, [isFaviconUpdated]);

  return (
    <ButtonGroup isAttached>
      <Button
        textColor={'white'}
        variant={'solid'}
        isActive={tabIndex === index}
        onClick={() => setTabIndex?.(index)}
        alignItems={'flex-start'}
        className="flex flex-row justify-start items-center w-full h-10 px-2 py-1 truncate"
      >
        <Favicon src={favicon} className="" />
        <div className="h-full flex-1 flex w-full justify-start items-center px-2">
          <div className="text-left ml-1 truncate w-full"> {title}</div>
        </div>
      </Button>
      {tabIndex !== index && (
        <IconButton
          aria-label="remove-tab"
          icon={<SmallCloseIcon />}
          onClick={() => removeTab?.(index)}
        />
      )}
    </ButtonGroup>
  );
}

export default Tab;
