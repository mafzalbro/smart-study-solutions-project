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
        "link": "#15803d",
        "link-hover": "#16a34a",
        "radial-circles": "radial-gradient(circle at 20% 20%, rgba(0, 255, 0, 0.05) 0%, rgba(0, 255, 0, 0) 100%), radial-gradient(circle at 80% 80%, rgba(0, 128, 0, 0.05) 0%, rgba(0, 128, 0, 0) 100%)",
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
          "50": "#ecfdf5",
          "100": "#d1fae5",
          "200": "#a7f3d0",
          "300": "#6ee7b7",
          "400": "#34d399",
          "500": "#10b981",
          "600": "#059669",
          "700": "#047857",
          "800": "#065f46",
          "900": "#064e3b"
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
          "DEFAULT": "#10b981",
          "hover": "#059669"
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
