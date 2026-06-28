import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Input supports two usage modes:
// 1. With React Hook Form: pass register={register('fieldName', rules)}
// 2. Plain controlled: pass value + onChange as usual via ...props
export default function Input({
  label,
  type = 'text',
  placeholder = '',
  register,        // RHF register result object: { name, ref, onChange, onBlur }
  error = null,
  className = '',
  rows = 4,
  ...props         // any extra HTML attributes (value, onChange, id, etc.)
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const resolvedType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const baseInputStyle =
    'w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200';

  // Spread RHF register props first so that any explicit props can override if needed
  const inputProps = {
    ...(register || {}),
    ...props,
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
          {label}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          className={`${baseInputStyle} resize-y min-h-[100px]`}
          rows={rows}
          {...inputProps}
        />
      ) : (
        <div className="relative w-full">
          <input
            type={resolvedType}
            placeholder={placeholder}
            className={`${baseInputStyle} ${isPasswordType ? 'pr-11' : ''}`}
            {...inputProps}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      )}

      {error && (
        <span className="text-xs font-sans text-red-400 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
}
