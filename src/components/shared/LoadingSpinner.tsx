import React from 'react';
import { Oval } from 'react-loader-spinner';

interface SpinnerProps {
  width?: number;
  height?: number;
  color?: string;
  secondaryColor?: string;
  strokeWidth?: string;
  label?: string;
  topPadding?: boolean;
}

const LoadingSpinner: React.FC<SpinnerProps> = ({
  width,
  height,
  color,
  secondaryColor,
  strokeWidth,
  label,
  topPadding,
}) => (
  <>
    {topPadding && <div className="h-10vh" />}
    <Oval
      width={width || 120}
      height={height || 120}
      strokeWidth={strokeWidth || 5}
      color={color || '#D45252'}
      secondaryColor={secondaryColor || '#A36C6C'}
    />
    <p className="text-center">{label || 'Loading...'}</p>
  </>
);

export default LoadingSpinner;
