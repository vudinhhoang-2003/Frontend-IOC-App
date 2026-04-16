import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TooltipProps {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}

export default function Tooltip({ children, label, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  if (disabled) return <>{children}</>;

  return (
    <div 
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative"
    >
      {children}
      {isVisible && createPortal(
        <div 
          className={cn(
            "fixed z-[9999] pointer-events-none",
            "px-3 py-1.5 rounded-lg border border-cyan/10 bg-surface/95 backdrop-blur-md shadow-xl shadow-cyan/5",
            "animate-in fade-in duration-150"
          )}
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-surface border-l border-b border-cyan/20" />
          <span className="text-xs font-bold text-text whitespace-nowrap tracking-wide leading-none">
            {label}
          </span>
        </div>,
        document.body
      )}
    </div>
  );
}
