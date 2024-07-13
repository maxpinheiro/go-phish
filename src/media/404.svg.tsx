import { shiftColorValue } from '@/utils/color.util';
import React from 'react';
import { SVGProps } from './LeftArrow.svg';

const NotFoundIcon: React.FC<SVGProps & { hexColor?: string }> = ({
  width = 192,
  height = 62,
  className = '',
  hexColor = '#D06767',
}) => (
  <svg width={width} height={height} viewBox="0 0 192 62" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="path-1-outside-1_594_260" maskUnits="userSpaceOnUse" x="67" y="0" width="62" height="62" fill="black">
      <rect fill="white" x="67" width="62" height="62" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M98 61C114.569 61 128 47.5685 128 31C128 14.4315 114.569 1 98 1C81.4315 1 68 14.4315 68 31C68 47.5685 81.4315 61 98 61ZM98 46C106.284 46 113 39.2843 113 31C113 22.7157 106.284 16 98 16C89.7157 16 83 22.7157 83 31C83 39.2843 89.7157 46 98 46Z"
      />
    </mask>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M98 61C114.569 61 128 47.5685 128 31C128 14.4315 114.569 1 98 1C81.4315 1 68 14.4315 68 31C68 47.5685 81.4315 61 98 61ZM98 46C106.284 46 113 39.2843 113 31C113 22.7157 106.284 16 98 16C89.7157 16 83 22.7157 83 31C83 39.2843 89.7157 46 98 46Z"
      fill={hexColor}
    />
    <path
      d="M127 31C127 47.0163 114.016 60 98 60V62C115.121 62 129 48.1208 129 31H127ZM98 2C114.016 2 127 14.9837 127 31H129C129 13.8792 115.121 0 98 0V2ZM69 31C69 14.9837 81.9837 2 98 2V0C80.8792 0 67 13.8792 67 31H69ZM98 60C81.9837 60 69 47.0163 69 31H67C67 48.1208 80.8792 62 98 62V60ZM112 31C112 38.732 105.732 45 98 45V47C106.837 47 114 39.8366 114 31H112ZM98 17C105.732 17 112 23.268 112 31H114C114 22.1634 106.837 15 98 15V17ZM84 31C84 23.268 90.268 17 98 17V15C89.1634 15 82 22.1634 82 31H84ZM98 45C90.268 45 84 38.732 84 31H82C82 39.8366 89.1634 47 98 47V45Z"
      fill={shiftColorValue(hexColor, -40)}
      mask="url(#path-1-outside-1_594_260)"
    />
    <path
      d="M36.1219 16.974V61H49V1H36.1219L1 36.8442V48.5325H34.9512V36.8442H15.8293L36.1219 16.974Z"
      fill={hexColor}
      stroke={shiftColorValue(hexColor, -40)}
    />
    <path
      d="M178.122 16.974V61H191V1H178.122L143 36.8442V48.5325H176.951V36.8442H157.829L178.122 16.974Z"
      fill={hexColor}
      stroke={shiftColorValue(hexColor, -40)}
    />
  </svg>
);

export default NotFoundIcon;
