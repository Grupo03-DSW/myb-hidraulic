import React from "react";

interface NavBarProps {
  title?: string;
  children?: React.ReactNode;
}

export const NavBar = ({ title = "Traelo", children }: NavBarProps) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-foreground shadow-sm">
      <div className="ml-2 text-2xl text-white font-bold">{title}</div>
      {children}
    </nav>
  );
};
//
