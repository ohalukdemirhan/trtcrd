import React from 'react';

interface CardProps {
  children: React.ReactNode;
  glass?: boolean;
  premium?: boolean;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component with optional glassmorphism and premium effects
 */
export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  premium = false,
  hover = false,
  className = '',
  onClick,
}) => {
  // Base classes
  let cardClasses = glass ? 'card-glass' : 'card';
  
  // Premium style
  if (premium) {
    cardClasses += ' gradient-border';
  }
  
  // Hover effect
  if (hover) {
    cardClasses += ' transform transition-all duration-200 hover:scale-102 hover:shadow-lg';
  }
  
  // Combine with any additional classes
  cardClasses += ` ${className}`;
  
  return (
    <div
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 