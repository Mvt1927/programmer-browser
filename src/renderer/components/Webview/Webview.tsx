import React, { useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

type WebviewProps = {
  url: string;
  viewRef: React.Ref<HTMLWebViewElement>;
};

const Webview = ({ url, viewRef }: WebviewProps) => {
  // open context menu
  const handleContextMenu = (
    e: React.MouseEvent<HTMLWebViewElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // get x and y position of the click
    const { x, y } = e.nativeEvent;
    console.log('context menu', x, y);
    // ipcRenderer.send('event-open-menu', { x, y });
  };

  return (
    <div className="w-full h-full rounded-md overflow-hidden flex">
      <webview
        ref={viewRef}
        className="bg-transparent flex-1"
        src={url}
        onContextMenu={handleContextMenu}
        useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
      />
    </div>
  );
};

export default Webview;
