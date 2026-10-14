import React, { useState } from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  type?: 'text' | 'number';
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number | string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  suffix,
  prefix,
  min = 0,
  max,
  step = 'any',
  placeholder,
  disabled = false,
  className = '',
  id,
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const [prevValue, setPrevValue] = useState(value);
  const [localVal, setLocalVal] = useState<string>(
    value !== undefined && value !== null ? String(value) : ''
  );
  const [isFocused, setIsFocused] = useState(false);

  // Sincronização idiomática em render para React 19 (sem useEffect cascading renders)
  if (value !== prevValue) {
    setPrevValue(value);
    if (!isFocused) {
      setLocalVal(value !== undefined && value !== null ? String(value) : '');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalVal(raw);

    if (type === 'number') {
      if (raw === '' || raw === '-') {
        onChange(0);
      } else {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (type === 'number') {
      if (localVal === '' || isNaN(parseFloat(localVal))) {
        setLocalVal('0');
        onChange(0);
      } else {
        const parsed = parseFloat(localVal);
        setLocalVal(String(parsed));
        onChange(parsed);
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-[12px] font-medium text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 select-none tracking-tight"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-[13px] font-medium text-[#86868B] select-none pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={localVal}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-11 px-3.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-[#D2D2D7] dark:border-[#38383A] rounded-xl text-[14px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums transition-all duration-200 placeholder:text-[#86868B] focus:bg-white dark:focus:bg-[#1C1C1E] focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 ${
            prefix ? 'pl-8' : ''
          } ${
            suffix
              ? suffix.length > 4
                ? 'pr-20'
                : suffix.length > 2
                ? 'pr-14'
                : 'pr-11'
              : ''
          } ${
            disabled
              ? 'bg-black/[0.03] dark:bg-white/[0.04] text-[#86868B] cursor-not-allowed border-black/[0.04] dark:border-white/[0.04]'
              : 'hover:border-[#86868B]/50'
          }`}
        />
        {suffix && (
          <span className="absolute right-3.5 text-[12px] font-medium text-[#86868B] select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
