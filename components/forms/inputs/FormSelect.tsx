"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";
import React from "react";

export type FormSelectProps = {
  id: string;
  label: string;
  required?: boolean;
  className?: string; // pass border/focus classes
  error?: string;
  hint?: string;
  value: string;
  onValueChange: (v: string) => void;
  onBlur?: () => void; // allows Formik touched
  children: React.ReactNode; // <SelectItem>s
  placeholder?: string;
};

export function FormSelect({
  id,
  label,
  required,
  className,
  error,
  hint,
  value,
  onValueChange,
  onBlur,
  children,
  placeholder,
}: FormSelectProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required ? "*" : null}
      </Label>
      <Select
        value={value}
        onValueChange={(v) => {
          onValueChange(v);
          // mark touched once user changed the value
          onBlur?.();
        }}
      >
        <SelectTrigger
          id={id}
          className={clsx(
            "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500",
            className,
            error && "border-red-400 focus:border-red-500 focus:ring-red-500"
          )}
        >
          <SelectValue placeholder={placeholder ?? `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

// Re-export SelectItem for convenience
export { SelectItem } from "@/components/ui/select";
