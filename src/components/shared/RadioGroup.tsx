import { useThemeContext } from '@/store/theme.store';
import React from 'react';

export type RadioOption = { value: string | number; label: string };

interface RadioGroupProps {
  options: RadioOption[];
  selected: string | number;
  select: (val: string | number) => void;
  containerClass?: string;
}

const isEmpty = (selected: string | number) => {
  if (typeof selected === 'string') {
    return !selected;
  } else if (typeof selected === 'number') {
    return isNaN(selected as number);
  } else {
    return false;
  }
};

const isSelected = (value: string | number, selected: string | number): boolean => {
  return selected === value || (value === 'total' && isEmpty(selected));
};

const borderClasses = (idx: number, listLength: number): string => {
  let classes: string[] = [];
  if (idx === 0) {
    classes.push('border-l', 'rounded-l-lg', 'border-r');
  } else if (idx === listLength - 1) {
    classes.push('border-r', 'rounded-r-lg', 'border-l', '-ml-[1px]');
  } else {
    classes.push('border-r');
  }
  return classes.join(' ');
};

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selected, select, containerClass = '' }) => {
  const { color } = useThemeContext();

  return (
    <div className={`flex flex-wrap justify-center rounded-lg ${containerClass}`}>
      {options.map(({ value, label }, idx) => (
        <div
          key={idx}
          className={`cursor-pointer h-full py-1.5 px-2 mt-1 border-t border-b border-${color} shadow ${borderClasses(
            idx,
            options.length
          )} ${isSelected(value, selected) ? `bg-${color} bg-opacity-15` : ''}`}
          onClick={() => select(value)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
