import React from 'react';
import { SVGProps } from './LeftArrow.svg';

const SignoutIcon: React.FC<SVGProps> = ({ width = 16, height = 16, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 46 46"
    fill="none"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.75 34.9375C27.75 35.3187 27.5986 35.6844 27.329 35.954C27.0594 36.2236 26.6937 36.375 26.3125 36.375H5.3125C4.93125 36.375 4.56562 36.2236 4.29603 35.954C4.02645 35.6844 3.875 35.3187 3.875 34.9375V11.0625C3.875 10.6813 4.02645 10.3156 4.29603 10.046C4.56562 9.77645 4.93125 9.625 5.3125 9.625H26.3125C26.6937 9.625 27.0594 9.77645 27.329 10.046C27.5986 10.3156 27.75 10.6813 27.75 11.0625V15.8125C27.75 16.1937 27.9014 16.5594 28.171 16.829C28.4406 17.0985 29 17.5 30 17.5C30.8551 17.5 30.9344 17.0985 31.204 16.829C31.4736 16.5594 31.625 16.1937 31.625 15.8125V10.0625C31.625 8.91875 31.1706 7.82185 30.3619 7.0131C29.5531 6.20435 28.4562 5.75 27.3125 5.75H4.3125C3.16875 5.75 2.07185 6.20435 1.2631 7.0131C0.454351 7.82185 0 8.91875 0 10.0625L0 35.9375C0 37.0812 0.454351 38.1781 1.2631 38.9869C2.07185 39.7957 3.16875 40.25 4.3125 40.25H27.3125C28.4562 40.25 29.5531 39.7957 30.3619 38.9869C31.1706 38.1781 31.625 37.0812 31.625 35.9375V30.1875C31.625 29.8063 31.5497 29.438 31.2827 29.171C30.7827 28.671 29.8812 28.5 29.5 28.5C29.1188 28.5 28.4406 28.9014 28.171 29.171C27.9014 29.4406 27.75 29.8063 27.75 30.1875V34.9375Z"
      fill="inherit"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M45.5803 24.0179C45.7141 23.8843 45.8203 23.7257 45.8928 23.5511C45.9653 23.3764 46.0026 23.1892 46.0026 23.0001C46.0026 22.811 45.9653 22.6238 45.8928 22.4492C45.8203 22.2745 45.7141 22.1159 45.5803 21.9824L36.9553 13.3574C36.6853 13.0874 36.3192 12.9358 35.9375 12.9358C35.5558 12.9358 35.1897 13.0874 34.9197 13.3574C34.6498 13.6273 34.4982 13.9934 34.4982 14.3751C34.4982 14.7568 34.6498 15.1229 34.9197 15.3929L41.0924 21.5626H15.8125C15.4313 21.5626 15.0656 21.7141 14.796 21.9836C14.5265 22.2532 14.375 22.6189 14.375 23.0001C14.375 23.3814 14.5265 23.747 14.796 24.0166C15.0656 24.2862 15.4313 24.4376 15.8125 24.4376H41.0924L34.9197 30.6074C34.6498 30.8773 34.4982 31.2434 34.4982 31.6251C34.4982 32.0068 34.6498 32.3729 34.9197 32.6429C35.1897 32.9128 35.5558 33.0644 35.9375 33.0644C36.3192 33.0644 36.6853 32.9128 36.9553 32.6429L45.5803 24.0179Z"
      fill="inherit"
    />
  </svg>
);

export default SignoutIcon;
