import React from 'react';
import { SVGProps } from './LeftArrow.svg';

const CloseIcon: React.FC<SVGProps> = ({ width = 20, height = 20, className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.8334 5.34166L14.6584 4.16666L10.0001 8.82499L5.34175 4.16666L4.16675 5.34166L8.82508 9.99999L4.16675 14.6583L5.34175 15.8333L10.0001 11.175L14.6584 15.8333L15.8334 14.6583L11.1751 9.99999L15.8334 5.34166Z"
      fill="currentColor"
    />
  </svg>
);

export default CloseIcon;
