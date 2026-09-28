'use client';

import { useId } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VehiclePicker({
  label,
  value,
  onValueChange,
  options,
  portalContainer,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  portalContainer?: HTMLElement | null;
}) {
  const id = useId();
  return (
    <div className="vehicle-field">
      <label htmlFor={id}>{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="h-auto min-h-12 gap-3 rounded-xl border-[var(--si-border)] bg-[var(--si-surface)] px-3 py-3 text-left font-normal text-[var(--si-ink)] focus:ring-[var(--si-primary)] dark:bg-[var(--si-surface)] [&>span]:line-clamp-none [&>span]:min-w-0 [&>span]:whitespace-normal [&>svg]:shrink-0"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          portalContainer={portalContainer}
          className="z-[100] max-h-[min(24rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="min-h-11 whitespace-normal py-2.5 focus:bg-[var(--si-soft)] focus:text-[var(--si-ink)] data-[state=checked]:bg-[var(--si-soft)] data-[state=checked]:text-[var(--si-ink)]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
