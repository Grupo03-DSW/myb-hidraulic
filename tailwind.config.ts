import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxHeight: {
        "80vh": "80vh",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        draw: {
          to: {
            strokeDashoffset: "0",
          },
        },
        circularDash: {
          "0%": {
            "stroke-dasharray": "1px, 200px",
            "stroke-dashoffset": "0",
          },
          "20%": {
            "stroke-dasharray": "100px, 200px",
            "stroke-dashoffset": "-15px",
          },
          "40%": {
            "stroke-dasharray": "251.33px, 251.33px", // Longitud total aproximada del círculo (2πr para r=40)
            "stroke-dashoffset": "0",
          },
          "100%": {
            "stroke-dasharray": "251.33px, 251.33px",
            "stroke-dashoffset": "0",
          },
        },
        failedCircularDash: {
          "0%": {
            "stroke-dasharray": "1px, 200px",
            "stroke-dashoffset": "0",
          },
          "10%": {
            "stroke-dasharray": "50px, 300px",
            "stroke-dashoffset": "20px",
          },
          "20%": {
            "stroke-dasharray": "50px, 251.33px",
            "stroke-dashoffset": "10px",
          },
          "30%": {
            "stroke-dasharray": "50px, 300px",
            "stroke-dashoffset": "20px",
          },
          "35%": {
            "stroke-dasharray": "60px, 251.33px",
            "stroke-dashoffset": "10px",
          },
          "40%": {
            "stroke-dasharray": "0px, 260px",
            "stroke-dashoffset": "-1px",
            "stroke-width": "1",
          },
          "41%": {
            "stroke-width": "0",
          },
          "100%": {
            "stroke-dasharray": "0px, 260px",
            "stroke-dashoffset": "-1px",
            "stroke-width": "0",
          },
        },
        jump: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "40%": { transform: "scale(0.8)", opacity: "0" },
          "42%": { opacity: "1" },
          "50%": { transform: "scale(1.4)" },
          "60%": { transform: "scale(1)" },
          "70%": { transform: "scale(1.3)" },
          "80%": { transform: "scale(1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        noiseContend: {
          "0%": { transform: "scale(1)", opacity: "0" },
          "45%": { transform: "scale(1)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
          "55%": { transform: "scale(1)" },
          "100": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.7s ease-in forwards",
        "spin-slow": "spin-slow 3s linear infinite",
        "spin-reverse": "spin-reverse 3s linear infinite",
        draw: "draw 4s ease-in-out forwards",
        circularDash: "circularDash 3s ease-in-out infinite",
        jump: "jump 3s ease-in-out infinite",
        failedCircularDash: "failedCircularDash 3s ease-in-out infinite",
        noiseContend: "noiseContend 3s ease-in-out forwards",
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
