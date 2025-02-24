import React from "react";
import { Settings } from "lucide-react";

interface LoadingGearProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  color?: string;
}

const sizeClasses = {
  sm: {
    content: "w-11 h-11",
    gear: "w-8 h-8",
    secondGear: "w-6 h-6",
    container: "gap-1",
    offset: "translate-x-5 -translate-y-3",
  },
  md: {
    content: "w-[87px] h-[87px]",
    gear: "w-16 h-16",
    secondGear: "w-12 h-12",
    container: "gap-2",
    offset: "translate-x-10 -translate-y-6",
  },
  lg: {
    content: "w-32 h-32",
    gear: "w-24 h-24",
    secondGear: "w-16 h-16",
    container: "gap-3",
    offset: "translate-x-16 -translate-y-8",
  },
};

export const LoadingGear = ({
  size = "md",
  color = "text-blue-600",
}: LoadingGearProps) => {
  return (
    <div className={`relative ${sizeClasses[size].content}`}>
      {/* First gear */}
      <div className="relative">
        <Settings
          className={`${sizeClasses[size].gear} ${color} animate-spin-slow`}
          strokeWidth={1.5}
        />
      </div>

      <div className={`absolute ${sizeClasses[size].offset}`}>
        <Settings
          className={`${sizeClasses[size].secondGear} ${color} animate-spin-reverse`}
          strokeWidth={2}
        />
      </div>
    </div>
  );
};
