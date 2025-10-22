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
      {/* R orange (arrière-plan) */}
      <span 
        className="text-[#F08040] transform hover:scale-110 transition-transform duration-200 relative"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-5deg) translateX(3px) translateY(2px)',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        R
      </span>
      {/* R bleu (premier plan) */}
      <span 
        className="text-[#6A70F0] transform hover:scale-110 transition-transform duration-200 relative z-10"
        style={{ 
          fontStyle: 'italic',
          transform: 'skew(-5deg) translateX(-3px)',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        R
      </span>
    </div>
  );
}
