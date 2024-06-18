import React from 'react';

type WebviewProps = {
  url: string;
  viewRef: React.Ref<HTMLWebViewElement>;
};

const Webview = ({ url, viewRef }: WebviewProps) => {
  return (
    <webview
      ref={viewRef}
      className=" w-full h-full rounded-md m-0 p-0"
      src={url}
      style={{
        height: 'inherit',
        backgroundColor: 'transparent',
      }}
      useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
    />
  );
};

export default Webview;
