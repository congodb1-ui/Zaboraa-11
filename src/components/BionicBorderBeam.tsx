import React from 'react';
import { useCustomization } from '../context/CustomizationContext';

interface BionicBorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BionicBorderBeam: React.FC<BionicBorderBeamProps> = ({
  className = '',
  duration = 8
}) => {
  const { siteConfig } = useCustomization();
  const animationsEnabled = siteConfig.adminSettings?.imageAnimationsEnabled ?? true;

  if (!animationsEnabled) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[-150%] animate-[spin_8s_linear_infinite]"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg 330deg, #06b6d4 345deg, #10b981 355deg, #38bdf8 360deg)',
          animationDuration: `${duration}s`
        }}
      />
    </div>
  );
};
