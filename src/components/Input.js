import React from 'react';

function Input({ type = 'text', className = '', ...props }) {
  return (
    <input
      type={type}
      className={`input ${className}`}
      {...props}
    />
  );
}

export default Input; 