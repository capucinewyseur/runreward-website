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
    <div className={`font-bold ${sizeClasses[size]} ${className} flex items-center`}>
      <span className="text-orange-500 drop-shadow-sm transform hover:scale-110 transition-transform duration-200">R</span>
      <span className="text-blue-600 drop-shadow-sm transform hover:scale-110 transition-transform duration-200">R</span>
    </div>
  );
}
