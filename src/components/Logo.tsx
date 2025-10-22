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
    <div className={`font-black ${sizeClasses[size]} ${className} flex items-center relative`}>
      {/* R orange (arrière-plan) avec effet de lueur */}
      <span 
        className="text-[#F08040] transform hover:scale-110 transition-transform duration-200 relative"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-8deg) translateX(2px) translateY(1px)',
          textShadow: '0 0 8px rgba(240, 128, 64, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.3)',
          filter: 'drop-shadow(0 0 6px rgba(240, 128, 64, 0.4))'
        }}
      >
        R
      </span>
      {/* R bleu (premier plan) avec effet de lueur */}
      <span 
        className="text-[#6A70F0] transform hover:scale-110 transition-transform duration-200 relative z-10"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-8deg) translateX(-6px)',
          textShadow: '0 0 8px rgba(106, 112, 240, 0.6), 2px 2px 4px rgba(0, 0, 0, 0.3)',
          filter: 'drop-shadow(0 0 6px rgba(106, 112, 240, 0.4))'
        }}
      >
        R
      </span>
    </div>
  );
}
