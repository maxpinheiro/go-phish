import React from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

interface OpaqueSkeletonProps extends SkeletonProps {
  opacityClass?: string;
  containerFill?: boolean;
}

const OpaqueSkeleton: React.FC<OpaqueSkeletonProps> = ({
  opacityClass = 'opacity-15',
  containerFill = true,
  containerClassName = '',
  className,
  ...props
}) => (
  <Skeleton
    className={`${opacityClass} ${className}`}
    containerClassName={containerClassName + (containerFill ? ' w-full' : '')}
    {...props}
  />
);

export default OpaqueSkeleton;
