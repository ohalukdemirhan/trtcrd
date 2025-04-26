import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'neumorphic' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  premium?: boolean;
  children: React.ReactNode;
}

/**
 * Button component with various styles and animations
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  premium = false,
  children,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Base classes
  let buttonClasses = `btn inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;

  // Variant classes
  switch (variant) {
    case 'primary':
      buttonClasses += ' btn-primary';
      break;
    case 'secondary':
      buttonClasses += ' btn-secondary';
      break;
    case 'neumorphic':
      buttonClasses += ' btn-neumorphic';
      break;
    case 'outline':
      buttonClasses += ' border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
      break;
    case 'ghost':
      buttonClasses += ' text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
      break;
    default:
      buttonClasses += ' btn-primary';
  }

  // Premium style
  if (premium) {
    buttonClasses += ' gradient-border';
  }

  // Hover and active states
  buttonClasses += ' hover:scale-102 active:scale-98';

  // Combine with any additional classes
  buttonClasses += ` ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}; 