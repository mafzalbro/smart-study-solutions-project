// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend:{
      "colors": {
        "primary": "#000000",
        "secondary": "#ffffff",
        "link": "#7c3aed",
        "link-hover": "#8b5cf6",
        "radial-circles": "radial-gradient(circle at 20% 20%, rgba(128, 0, 128, 0.05) 0%, rgba(128, 0, 128, 0) 100%), radial-gradient(circle at 80% 80%, rgba(75, 0, 130, 0.05) 0%, rgba(75, 0, 130, 0) 100%)",
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
          "50": "#f5f3ff",
          "100": "#ede9fe",
          "200": "#ddd6fe",
          "300": "#c4b5fd",
          "400": "#a78bfa",
          "500": "#8b5cf6",
          "600": "#7c3aed",
          "700": "#6d28d9",
          "800": "#5b21b6",
          "900": "#4c1d95"
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
          "DEFAULT": "#8b5cf6",
          "hover": "#7c3aed"
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
