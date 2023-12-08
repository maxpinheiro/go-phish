import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useThemeContext } from '@/store/theme.store';

interface LoadingOverlayProps {
  loadingMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingMessage = 'Loading...' }) => {
  const { color } = useThemeContext();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        paddingTop: '30vh',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        <LoadingSpinner label=" " />
        <p className={`text-center text-${color}`}>{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
