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
      {/* R orange (arrière-plan) avec décalage */}
      <span 
        className="text-[#F08040] transform hover:scale-110 transition-transform duration-200 relative"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-8deg) translateX(4px) translateY(2px)',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        R
      </span>
      {/* R bleu (premier plan) */}
      <span 
        className="text-[#6A70F0] transform hover:scale-110 transition-transform duration-200 relative z-10"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-8deg) translateX(-4px)',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        R
      </span>
    </div>
  );
}
