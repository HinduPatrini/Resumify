import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder = '',
  register = {},
  error = null,
  className = '',
  rows = 4,
  ...props
}) {
  const baseInputStyle = 'w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200';
  
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
          {label}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          className={`${baseInputStyle} resize-y min-h-[100px]`}
          rows={rows}
          {...register}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={baseInputStyle}
          {...register}
          {...props}
        />
      )}
      
      {error && (
        <span className="text-xs font-sans text-red-400 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
}
