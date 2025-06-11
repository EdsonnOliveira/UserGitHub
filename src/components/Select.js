import React from 'react';

function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`input ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select; 