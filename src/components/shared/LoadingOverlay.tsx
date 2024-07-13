import { useThemeContext } from '@/store/theme.store';
import { desaturateColor } from '@/utils/color.util';
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  loadingMessage?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loadingMessage = 'Loading...' }) => {
  const { color, hexColor } = useThemeContext();
  const desatColor = desaturateColor(hexColor, 0.5);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        zIndex: 4200,
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '50vh',
          left: '50vw',
          transform: 'translate(-50%, -50%)',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        <LoadingSpinner label="&nbsp;" color={hexColor} secondaryColor={desatColor} />
        <p className={`text-center text-${color} font-medium`}>{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
