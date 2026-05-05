import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string | null;
}

export default function Logo({ className = '', size = 'md', logoUrl }: LogoProps) {
  const [hasError, setHasError] = React.useState(false);

  const getSizing = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8 text-xl';
      case 'lg': return 'w-16 h-16 text-4xl';
      case 'xl': return 'w-24 h-24 text-6xl';
      default: return 'w-12 h-12 text-2xl';
    }
  };

  const LeafGreenS = (
    <div className={`${getSizing()} bg-[#4CAF50] rounded-2xl flex items-center justify-center text-white font-black serif shadow-inner`}>
      S
    </div>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoUrl && !hasError ? (
        <img 
          src={logoUrl} 
          alt="Simphony Logo" 
          className={`${getSizing().split(' ')[0]} ${getSizing().split(' ')[1]} object-contain`}
          onError={() => setHasError(true)}
        />
      ) : (
        LeafGreenS
      )}
    </div>
  );
}
