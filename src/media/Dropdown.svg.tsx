import React from 'react';
import { SVGProps } from './LeftArrow.svg';

const DropDownIcon: React.FC<SVGProps> = ({ width = 19, height = 12, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 12"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 1.58979L9.5 11.0898L19 1.58979C18.8003 0.242262 18.4574 -0.213195 17 0.0897945L9.5 7.58979L2 0.0897945C0.45111 -0.054589 0.107254 0.366464 0 1.58979Z"
      fill="inherit"
    />
  </svg>
);

export default DropDownIcon;
