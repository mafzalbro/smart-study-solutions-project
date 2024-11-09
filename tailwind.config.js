// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        link: "#1e3a8a", // Link color
        "link-hover": "#2563eb", // Link hover color
        "radial-circles":
          "radial-gradient(circle at 20% 20%, rgba(0, 0, 255, 0.05) 0%, rgba(0, 0, 255, 0) 100%), radial-gradient(circle at 80% 80%, rgba(255, 0, 0, 0.05) 0%, rgba(255, 0, 0, 0) 100%), radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.05) 0%, rgba(255, 165, 0, 0) 100%), radial-gradient(circle at 30% 70%, rgba(255, 192, 203, 0.05) 0%, rgba(255, 192, 203, 0) 100%)",
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        shade: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        link: {
          DEFAULT: "#3b82f6", // Accent 500
          hover: "#2563eb", // Accent 600
        },
      },
      borderRadius: {
        lg: "12px",
        xl: "30px",
      },
      animation: {
        "spin-fast": "spin 0.4s linear infinite",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
};
