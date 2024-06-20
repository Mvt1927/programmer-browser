import { useContext } from 'react';
import { SidebarToggleContext } from 'renderer/context/Alpha/SidebarToggleContext';
import { TabList } from '../Tab';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

function Sidebar() {
  const { isOpen, setIsOpen } = useContext(SidebarToggleContext);
  return (
    <Drawer
      isOpen={isOpen || false}
      placement="left"
      onClose={setIsOpen?.toggle || (() => {})}
      closeOnOverlayClick
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton color={'white'} />
        <DrawerHeader color={'white'}>Tab list</DrawerHeader>
        <DrawerBody>
          <TabList />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default Sidebar;
