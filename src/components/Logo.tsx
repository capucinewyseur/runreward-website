'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className} flex items-center relative`}>
      {/* R bleu (devant) */}
      <span 
        className="text-[#6A70F0] drop-shadow-sm transform hover:scale-110 transition-transform duration-200 relative z-10"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-5deg)',
          textShadow: '2px 2px 4px rgba(106, 112, 240, 0.3)'
        }}
      >
        R
      </span>
      {/* R orange (derrière) */}
      <span 
        className="text-[#F08040] drop-shadow-sm transform hover:scale-110 transition-transform duration-200 relative"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-5deg) translateX(-8px)',
          textShadow: '2px 2px 4px rgba(240, 128, 64, 0.3)'
        }}
      >
        R
      </span>
    </div>
  );
}
