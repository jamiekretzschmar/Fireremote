
import React from 'react';

interface RemoteButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  primary?: boolean;
}

const RemoteButton: React.FC<RemoteButtonProps> = ({ onClick, children, className = "", title, primary }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center 
        transition-all duration-100 active:scale-90 active:bg-zinc-700
        rounded-full shadow-lg border border-zinc-800
        ${primary ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-400'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default RemoteButton;
