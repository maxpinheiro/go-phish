import React from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

interface OpaqueSkeletonProps extends SkeletonProps {
  opacityClass?: string;
}

const OpaqueSkeleton: React.FC<OpaqueSkeletonProps> = ({ opacityClass = 'opacity-15', className, ...props }) => (
  <Skeleton className={`${opacityClass} ${className}`} {...props} />
);

export default OpaqueSkeleton;
