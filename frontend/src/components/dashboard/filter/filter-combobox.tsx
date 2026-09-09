"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxValue = string | boolean;

export interface ComboboxOption<T extends ComboboxValue> {
  label: string;
  value: T;
}

interface DataTableFilterComboboxProps<T extends ComboboxValue> {
  options: ComboboxOption<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allLabel?: string;
  className?: string;
}

export function DataTableFilterCombobox<T extends ComboboxValue>({
  options,
  value,
  onChange,
  placeholder = "Pilih opsi",
  searchPlaceholder = "Cari...",
  emptyMessage = "Data tidak ditemukan.",
  allLabel,
  className,
}: DataTableFilterComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const buttonLabel = selectedOption?.label ?? allLabel ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "flex h-9 w-full items-center justify-between rounded-md border px-3",
              "text-sm shadow-sm transition-colors",
              "sm:w-[200px]",
              className,
            )}
          >
            <span className="min-w-0 truncate">{buttonLabel}</span>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        }
      />

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />

          <CommandList className="max-h-[240px] overflow-y-auto">
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            <CommandGroup>
              {allLabel && (
                <CommandItem
                  value="__all__"
                  onSelect={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === undefined ? "opacity-100" : "opacity-0",
                    )}
                  />

                  <span className="truncate">{allLabel}</span>
                </CommandItem>
              )}

              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={String(option.value)}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />

                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
