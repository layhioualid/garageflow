export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {

      /* ===== COLORS SYSTEM (SAAS) ===== */
      colors: {

        bg: "#0a0f1c",          // background global
        panel: "#0f172a",      // sidebar / panels
        card: "#111827",       // cards

        border: "rgba(255,255,255,0.06)",

        primary: "#3b82f6",
        primarySoft: "rgba(59,130,246,0.2)",

        success: "#10b981",
        warning: "#facc15",
        danger: "#ef4444",

        text: "#ffffff",
        muted: "#94a3b8",
      },

      /* ===== BORDER RADIUS ===== */
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "22px",
      },

      /* ===== SHADOWS (SAAS STYLE) ===== */
      boxShadow: {
        sm: "0 4px 10px rgba(0,0,0,0.25)",
        md: "0 10px 30px rgba(0,0,0,0.35)",
        lg: "0 20px 60px rgba(0,0,0,0.45)",
      },

      /* ===== BLUR SYSTEM ===== */
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
      },

      /* ===== ANIMATIONS ===== */
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },

        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        float: "float 3s ease-in-out infinite",
      },

      /* ===== SPACING (clean SaaS layout) ===== */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },

      /* ===== FONT SIZE (dashboard UX) ===== */
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
      }
    }
  },

  plugins: []
};