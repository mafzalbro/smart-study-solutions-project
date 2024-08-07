// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      "colors": {
        "primary": "#000000",
        "secondary": "#ffffff",
        "link": "#ea580c",
        "link-hover": "#f97316",
        "radial-circles": "radial-gradient(circle at 20% 20%, rgba(255, 165, 0, 0.05) 0%, rgba(255, 165, 0, 0) 100%), radial-gradient(circle at 80% 80%, rgba(255, 69, 0, 0.05) 0%, rgba(255, 69, 0, 0) 100%)",
        "neutral": {
          "50": "#f9fafb",
          "100": "#f3f4f6",
          "200": "#e5e7eb",
          "300": "#d1d5db",
          "400": "#9ca3af",
          "500": "#6b7280",
          "600": "#4b5563",
          "700": "#374151",
          "800": "#1f2937",
          "900": "#111827"
        },
        "accent": {
          "50": "#fff7ed",
          "100": "#ffedd5",
          "200": "#fed7aa",
          "300": "#fdba74",
          "400": "#fb923c",
          "500": "#f97316",
          "600": "#ea580c",
          "700": "#c2410c",
          "800": "#9a3412",
          "900": "#7c2d12"
        },
        "shade": {
          "50": "#f8fafc",
          "100": "#f1f5f9",
          "200": "#e2e8f0",
          "300": "#cbd5e1",
          "400": "#94a3b8",
          "500": "#64748b",
          "600": "#475569",
          "700": "#334155",
          "800": "#1e293b",
          "900": "#0f172a"
        },
        "link": {
          "DEFAULT": "#f97316",
          "hover": "#ea580c"
        }
      }
    }
    
    ,
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  darkMode: 'class',
  plugins: [],
};
