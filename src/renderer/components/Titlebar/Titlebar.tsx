import TabActions from '../TabActions';
import TitlebarContainer from '../TitlebarContainer';

function Titlebar() {
  return (
    <TitlebarContainer className="w-full h-14 m-0 p-0 flex">
      <TabActions />
    </TitlebarContainer>
  );
}

export default Titlebar;
