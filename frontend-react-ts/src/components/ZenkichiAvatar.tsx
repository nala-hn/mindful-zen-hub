import React from 'react';

type AvatarStatus = 'up' | 'down' | 'stable';

interface Props {
  status: AvatarStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

const ZenkichiAvatar: React.FC<Props> = ({ status, size = 'lg' }) => {
  const avatarMap: Record<AvatarStatus, { icon: string; color: string; label: string, shadow: string, glow: string }> = {
    up: { 
      icon: '🔥', 
      color: 'bg-orange-100', 
      label: 'On Fire!',
      shadow: 'shadow-orange-200',
      glow: 'bg-orange-400'
    },
    stable: { 
      icon: '🧘‍♂️', 
      color: 'bg-green-100', 
      label: 'Stable', 
      shadow: 'shadow-green-200',
      glow: 'bg-green-400'
    },
    down: { 
      icon: '☁️', 
      color: 'bg-gray-100', 
      label: 'Down', 
      shadow: 'shadow-gray-200',
      glow: 'bg-gray-400'
    },
  };

  const current = avatarMap[status as AvatarStatus] || avatarMap['stable'];

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl border-2', 
    md: 'w-20 h-20 text-4xl border-4',
    lg: 'w-32 h-32 text-6xl border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        {size === 'lg' && (
          <div className={`absolute -inset-1.5 rounded-full opacity-30 blur-lg transition duration-1000 group-hover:opacity-60 ${current.glow} animate-pulse`}></div>
        )}
        
        <div className={`
          relative 
          ${sizeClasses[size]} 
          ${current.color} 
          ${size === 'lg' ? `${current.shadow} shadow-2xl animate-bounce-slow` : 'shadow-sm'} 
          rounded-full flex items-center justify-center 
          border-white transition-all duration-500
        `}>
          {current.icon}
        </div>
      </div>

      {size === 'lg' && (
        <span className="mt-5 px-4 py-1.5 bg-white rounded-full text-[10px] font-black shadow-sm border border-gray-100 uppercase tracking-[0.2em] text-gray-500">
          State: {current.label}
        </span>
      )}
    </div>
  );
};

export default ZenkichiAvatar;