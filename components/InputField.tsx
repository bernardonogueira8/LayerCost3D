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
        className="text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-zinc-200 select-none tracking-tight"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-sm font-semibold text-slate-500 dark:text-zinc-400 select-none pointer-events-none">
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
          className={`w-full h-11 sm:h-12 px-4 bg-white dark:bg-[#1B202D] border border-slate-300 dark:border-white/10 rounded-xl text-[15px] sm:text-[16px] font-semibold text-slate-900 dark:text-white tabular-nums transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-[#0071E3] dark:focus:border-[#2997FF] focus:ring-4 focus:ring-[#0071E3]/15 dark:focus:ring-[#2997FF]/20 focus:outline-none ${
            prefix ? 'pl-9' : ''
          } ${suffix ? 'pr-14' : ''} ${
            disabled
              ? 'bg-slate-100 dark:bg-[#141721] text-slate-400 dark:text-zinc-600 cursor-not-allowed border-slate-200 dark:border-white/5'
              : 'hover:border-slate-400 dark:hover:border-white/20'
          }`}
        />
        {suffix && (
          <span className="absolute right-4 text-xs sm:text-[13px] font-medium text-slate-500 dark:text-zinc-400 select-none pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
