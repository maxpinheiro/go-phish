import React from 'react';
import { SVGProps } from './LeftArrow.svg';

const Donut: React.FC<SVGProps> = ({ width = 20, height = 20, className = '' }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" className={className}>
    <path d="M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,16a6,6,0,1,1,6-6A6,6,0,0,1,10,16Z" fill="inherit" />
  </svg>
);

export default Donut;
