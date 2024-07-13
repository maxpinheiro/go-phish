import React from 'react';
import BackArrow from './BackArrow';

interface BackLinkProps {
  link?: string;
  text: JSX.Element | string;
  onClick?: () => void;
  className?: string;
  svgClass?: string;
  width?: number;
  height?: number;
}

const BackLink: React.FC<BackLinkProps> = ({
  link,
  text,
  onClick,
  className = 'cursor-pointer flex items-center space-x-2',
  svgClass = 'fill-black dark:fill-white',
}) => {
  return (
    <div className="flex items-center space-x-2 ">
      <BackArrow width={16} height={16} link={link} onClick={onClick} className={className} svgClass={svgClass}>
        {typeof text === 'string' ? <p className="">{text}</p> : text}
      </BackArrow>
    </div>
  );
};

export default BackLink;
