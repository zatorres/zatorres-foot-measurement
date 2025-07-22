import React from 'react';

interface SocksIconProps {
  size?: number;
  className?: string;
}

export const SocksIcon: React.FC<SocksIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Left sock - positioned slightly behind */}
      <path d="M5 4 L5 20 Q5 22 7 22 L17 22 Q19 22 19 20 L19 4 Q19 2 17 2 L7 2 Q5 2 5 4" />
      
      {/* Right sock - positioned slightly in front */}
      <path d="M7 3 L7 19 Q7 21 9 21 L19 21 Q21 21 21 19 L21 3 Q21 1 19 1 L9 1 Q7 1 7 3" />
      
      {/* Ribbed cuff texture on left sock */}
      <path d="M6 4 L6 6" />
      <path d="M8 4 L8 6" />
      <path d="M10 4 L10 6" />
      <path d="M12 4 L12 6" />
      <path d="M14 4 L14 6" />
      <path d="M16 4 L16 6" />
      <path d="M18 4 L18 6" />
      
      {/* Ribbed cuff texture on right sock */}
      <path d="M8 3 L8 5" />
      <path d="M10 3 L10 5" />
      <path d="M12 3 L12 5" />
      <path d="M14 3 L14 5" />
      <path d="M16 3 L16 5" />
      <path d="M18 3 L18 5" />
      <path d="M20 3 L20 5" />
      
      {/* Heel detail on left sock */}
      <path d="M5 16 Q5 18 7 18 L17 18 Q19 18 19 16" />
      
      {/* Heel detail on right sock */}
      <path d="M7 15 Q7 17 9 17 L19 17 Q21 17 21 15" />
    </svg>
  );
}; 