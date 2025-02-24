import React from 'react';

interface TitleBarProps {
  left: JSX.Element | string;
  center: JSX.Element | string;
  right: JSX.Element | string;
  px?: string | number;
  py?: string | number;
}

const TitleBar: React.FC<TitleBarProps> = ({ left, center, right, px = '4', py = '4' }) => {
  return (
    <div className={`flex items-center w-full justify-center px-${px} py-${py} relative`}>
      <div className="absolute left-0">{left}</div>
      {typeof center === 'string' ? <p className="text-2xl font-light">{center}</p> : center}
      <div className="absolute right-0">{right}</div>
    </div>
  );
};

export default TitleBar;
