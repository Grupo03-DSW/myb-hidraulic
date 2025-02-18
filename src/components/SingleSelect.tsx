import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

interface SingleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export const SingleSelect = ({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage,
  className,
}: SingleSelectProps) => {
  return (
    <Select value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger
        className={cn(
          "w-full justify-between bg-transparent h-full py-2 text-gray-500 border-primary-foreground",
          value !== undefined && "text-gray-900 bg-background",
          className
        )}
      >
        <SelectValue placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.length > 0 ? (
          options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="focus:bg-primary focus:text-white focus:py-3 transition-all duration-100 ease-in-out"
            >
              {option.label}
            </SelectItem>
          ))
        ) : (
          <p className="p-2 text-gray-500">
            {emptyMessage || "No options available"}
          </p>
        )}
      </SelectContent>
    </Select>
  );
};
