import LeftArrow from '@/media/LeftArrow.svg';
import { useRouter } from 'next/router';
import React from 'react';

interface BackArrowProps {
  link?: string;
  onClick?: () => void;
  className?: string;
  svgClass?: string;
  width?: number;
  height?: number;
  children?: JSX.Element;
}
const BackArrow: React.FC<BackArrowProps> = ({
  link,
  onClick,
  className = 'cursor-pointer',
  svgClass = '',
  width,
  height,
  children,
}) => {
  const router = useRouter();
  const defaultClick = () => router.push(link || '/shows');
  return (
    <div onClick={onClick || defaultClick} className={className}>
      <LeftArrow width={width} height={height} className={svgClass} />
      {children}
    </div>
  );
};

export default BackArrow;
