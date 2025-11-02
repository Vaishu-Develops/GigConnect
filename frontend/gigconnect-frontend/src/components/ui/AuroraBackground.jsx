import React from 'react';
import { cn } from '../../lib/utils';

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <>
      <div
        className={cn(
          "relative flex h-screen w-full flex-col items-center justify-center bg-emerald-900 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Aurora Wave Layer 1 - Main flowing curtain */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, rgba(16, 185, 129, 0.7) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 20%, rgba(52, 211, 153, 0.5) 0%, transparent 60%),
              radial-gradient(ellipse 100% 60% at 40% 80%, rgba(110, 231, 183, 0.4) 0%, transparent 50%)
            `,
            animation: 'aurora-wave 25s ease-in-out infinite',
            filter: 'blur(3px)',
          }}
        />
        
        {/* Aurora Wave Layer 2 - Dancing ribbons */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 0%, 
                rgba(16, 185, 129, 0.6) 20%, 
                transparent 25%,
                rgba(52, 211, 153, 0.5) 45%,
                transparent 50%,
                rgba(110, 231, 183, 0.4) 70%,
                transparent 75%,
                rgba(167, 243, 208, 0.3) 95%,
                transparent 100%
              )
            `,
            backgroundSize: '400% 200%',
            animation: 'aurora-dance 18s ease-in-out infinite',
            filter: 'blur(2px)',
          }}
        />
        
        {/* Aurora Wave Layer 3 - Vertical streams */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(52, 211, 153, 0.6) 0%,
                transparent 20%,
                rgba(16, 185, 129, 0.5) 40%,
                transparent 50%,
                rgba(110, 231, 183, 0.4) 70%,
                transparent 80%,
                rgba(167, 243, 208, 0.3) 100%
              )
            `,
            backgroundSize: '100% 300%',
            animation: 'aurora-stream 30s ease-in-out infinite',
            filter: 'blur(4px)',
          }}
        />
        
        {/* Subtle shimmer particles */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle 2px at 15% 25%, rgba(255, 255, 255, 0.8) 0%, transparent 70%),
              radial-gradient(circle 1px at 35% 55%, rgba(167, 243, 208, 0.9) 0%, transparent 70%),
              radial-gradient(circle 1px at 75% 15%, rgba(110, 231, 183, 0.7) 0%, transparent 70%),
              radial-gradient(circle 2px at 85% 75%, rgba(52, 211, 153, 0.6) 0%, transparent 70%),
              radial-gradient(circle 1px at 25% 85%, rgba(255, 255, 255, 0.5) 0%, transparent 70%),
              radial-gradient(circle 1px at 65% 35%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)
            `,
            animation: 'aurora-shimmer 45s ease-in-out infinite',
          }}
        />
        
        {/* Atmospheric depth gradient */}
        {showRadialGradient && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.2) 0%, transparent 70%),
                linear-gradient(180deg, rgba(5, 150, 105, 0.15) 0%, transparent 90%)
              `,
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </>
  );
};

export default AuroraBackground;