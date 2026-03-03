import React from "react";

export type ColorTheme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  border: string;
  text: string;
};

export interface OrbitComponentProps {
  children?: React.ReactNode;
  className?: string;
  theme?: ColorTheme;
}

export interface GeneratedComponent {
  title: string;
  description: string;
  code: string;
}
