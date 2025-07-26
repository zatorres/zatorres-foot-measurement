import React from 'react';
import zatorresLogo from '../../assets/Z logo.jpg';

interface ZatorresLogoProps {
  variant?: 'full' | 'icon-only' | 'text';
  size?: number;
  className?: string;
}

// Logo using the actual Zatorres logo image
const ZatorresLogoComponent: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <img 
    src={zatorresLogo} 
    alt="Zatorres Logo" 
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

// Icon-only version for smaller spaces
const IconOnlyLogo: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <img 
    src={zatorresLogo} 
    alt="Zatorres Logo" 
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

// Text-based logo that will definitely render
const TextLogo: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <img 
    src={zatorresLogo} 
    alt="Zatorres Logo" 
    className={className}
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const ZatorresLogo: React.FC<ZatorresLogoProps> = ({ 
  variant = 'text', 
  size = 24, 
  className = "" 
}) => {
  if (variant === 'text') {
    return <TextLogo size={size} className={className} />;
  }
  
  if (variant === 'full') {
    return <ZatorresLogoComponent size={size} className={className} />;
  }
  
  return <IconOnlyLogo size={size} className={className} />;
};

export default ZatorresLogo; 