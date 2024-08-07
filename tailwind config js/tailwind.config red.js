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
        "link": "#b91c1c",
        "link-hover": "#dc2626",
        "radial-circles": "radial-gradient(circle at 20% 20%, rgba(255, 0, 0, 0.05) 0%, rgba(255, 0, 0, 0) 100%), radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%)",
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
          "50": "#fee2e2",
          "100": "#fecaca",
          "200": "#fca5a5",
          "300": "#f87171",
          "400": "#ef4444",
          "500": "#dc2626",
          "600": "#b91c1c",
          "700": "#991b1b",
          "800": "#7f1d1d",
          "900": "#651818"
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
          "DEFAULT": "#dc2626",
          "hover": "#b91c1c"
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
