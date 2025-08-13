"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import React from "react";

export type FormInputProps = {
  id: string;
  label: string;
  required?: boolean;
  className?: string; 
  error?: string;
  hint?: string;
  type?: React.HTMLInputTypeAttribute;
  value: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: string) => void;
  onBlur?: () => void;
};

export function FormInput({
  id,
  label,
  required,
  className,
  error,
  hint,
  type = "text",
  value,
  placeholder,
  min,
  max,
  step,
  onChange,
  onBlur,
}: FormInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required ? "*" : null}
      </Label>
      <Input
        id={id}
        type={type}
        value={value as any}
        placeholder={placeholder}
        min={min as any}
        max={max as any}
        step={step as any}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={clsx(
          "border-emerald-200 focus:border-emerald-500 focus-visible:ring-emerald-500",
          className,
          error && "border-red-400 focus:border-red-500 focus-visible:ring-red-500"
        )}
      />
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
