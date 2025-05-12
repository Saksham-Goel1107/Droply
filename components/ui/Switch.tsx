"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    switch: "h-5 w-9",
    dot: "h-3.5 w-3.5",
  },
  md: {
    switch: "h-6 w-11",
    dot: "h-4 w-4",
  },
  lg: {
    switch: "h-7 w-14",
    dot: "h-5 w-5",
  },
};

export function Switch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className = "",
}: SwitchProps) {
  const sizes = sizeClasses[size];

  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`${
        checked ? "bg-primary" : "bg-default-200"
      } relative inline-flex ${
        sizes.switch
      } shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        aria-hidden="true"
        className={`${
          checked ? "translate-x-full" : "translate-x-0"
        } pointer-events-none inline-block ${
          sizes.dot
        } transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        style={{
          transform: `translate(${checked ? "100%" : "0"}, -50%)`,
          position: "absolute",
          top: "50%",
          left: 0,
        }}
      />
    </HeadlessSwitch>
  );
}
