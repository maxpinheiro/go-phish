import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

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
    <BallTriangle width={width || 120} height={height || 120} color={color || '#D45252'} />
    <p className="text-center">{label || 'Loading...'}</p>
  </>
);

export default LoadingSpinner;
