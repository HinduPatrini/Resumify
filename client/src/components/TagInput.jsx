import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Type tag & press Enter...',
  className = '',
}) {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e) => {
    // Catch Enter or Comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const cleanTag = inputVal.trim().replace(/^,+|,+$/g, '');
    if (cleanTag && !value.includes(cleanTag)) {
      const updated = [...value, cleanTag];
      onChange(updated);
      setInputVal('');
    } else if (!cleanTag) {
      setInputVal('');
    }
  };

  const removeTag = (indexToRemove) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 bg-dark-input border border-dark-border rounded-lg min-h-[46px] focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition-all duration-200">
        {/* Render chips */}
        {value.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-[#8b7df7] border border-accent/20 rounded-full text-xs font-semibold font-sans max-w-full break-all"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-[#8b7df7] hover:text-white transition-colors rounded-full hover:bg-accent/20 p-0.5 shrink-0 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        {/* Raw Text Input */}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-0 outline-none text-sm text-text-primary px-1 min-w-[120px] focus:ring-0 focus:outline-none py-1"
        />
      </div>
    </div>
  );
}
