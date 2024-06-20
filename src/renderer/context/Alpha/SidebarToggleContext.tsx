import { useBoolean } from '@chakra-ui/react';
import { createContext } from 'react';

const props = {
  isOpen: false,
  setIsOpen: {
    on: () => {},
    off: () => {},
    toggle: () => {},
  },
};

type SidebarToggleContextProps = typeof props;

export const SidebarToggleContext =
  createContext<Partial<SidebarToggleContextProps>>(props);

type SidebarToggleProviderProps = {
  children: React.ReactNode;
};

export function SidebarToggleProvider({
  children,
}: SidebarToggleProviderProps) {
  const [isOpen, setIsOpen] = useBoolean(false);

  return (
    <SidebarToggleContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarToggleContext.Provider>
  );
}
