import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
//import { BrowserPage } from './views/Browser';
import Alpha from './views/Alpha/Alpha';
import { useHotkeys } from 'react-hotkeys-hook';

export default function App() {
  useHotkeys(
    'alt+x',
    () => {
      console.log('Close All Tabs');
      // setTabs([]);
    },
    { scopes: 'close_all_tab' }
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Alpha />} />
        {/* <Route path="/" element={<BrowserPage />} /> */}
      </Routes>
    </Router>
  );
}
