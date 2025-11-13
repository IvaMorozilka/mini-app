'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = {
  id: string;
  name: string;
};

type MultiSelectFilterProps = {
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiSelectFilter({
  options,
  selected,
  onSelectionChange,
  placeholder = 'Выберите...',
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (optionId: string) => {
    if (selected.includes(optionId)) {
      onSelectionChange(selected.filter((id) => id !== optionId));
    } else {
      onSelectionChange([...selected, optionId]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectionChange([]);
  };

  const selectedNames = options
    .filter((opt) => selected.includes(opt.id))
    .map((opt) => opt.name);

  const displayText =
    selectedNames.length === 0
      ? placeholder
      : selectedNames.length === 1
      ? selectedNames[0]
      : `Выбрано: ${selectedNames.length}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between h-9 text-sm font-normal',
            className
          )}
        >
          <span className="truncate">{displayText}</span>
          <div className="flex items-center gap-1">
            {selected.length > 0 && (
              <button
                type="button"
                className="size-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
              >
                <X className="size-4" />
              </button>
            )}
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => handleToggle(option.id)}
            >
              <Checkbox
                id={option.id}
                checked={selected.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
              />
              <label
                htmlFor={option.id}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

