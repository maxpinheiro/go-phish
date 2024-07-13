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
    <div className={`flex items-center w-full max-w-500 justify-between px-${px} py-${py}`}>
      {left}
      {typeof center === 'string' ? <p className="text-2xl font-light">{center}</p> : center}
      {right}
    </div>
  );
};

export default TitleBar;
