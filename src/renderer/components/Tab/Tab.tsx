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

  return (
    <ButtonGroup isAttached>
      <Button
        textColor={'white'}
        variant={'solid'}
        isActive={tabIndex === index}
        onClick={() => setTabIndex?.(index)}
        alignItems={'flex-start'}
        className="flex flex-row justify-start items-center w-full h-10 px-2 py-1 text-left text-clip"
      >
        <Favicon src={favicon} />
        <div className="flex-1 text-left ml-1 text-clip">
          {title?.length > 20 ? title?.slice(0, 20) + '...' : title}
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
