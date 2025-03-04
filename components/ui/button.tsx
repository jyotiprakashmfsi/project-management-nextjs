import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};