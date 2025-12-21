import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import type { LucideProps } from "lucide-react";

interface AppIconProps
  extends Omit<LucideProps, "size" | "color" | "strokeWidth"> {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: AppIconProps) {
  const IconComponent = LucideIcons[
    name as keyof typeof LucideIcons
  ] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}

export default Icon;
