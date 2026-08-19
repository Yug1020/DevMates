import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-dim": "#0e1511",
        "surface-container": "#1a211d",
        "on-secondary-fixed": "#001e2f",
        "surface-container-highest": "#2f3632",
        "inverse-primary": "#006c49",
        "primary-container": "#10b981",
        "surface": "#0e1511",
        "on-primary-fixed-variant": "#005236",
        "inverse-on-surface": "#2b322d",
        "on-tertiary-fixed-variant": "#842225",
        "tertiary-fixed-dim": "#ffb3af",
        "secondary": "#89ceff",
        "on-tertiary": "#650911",
        "primary": "#4edea3",
        "secondary-fixed": "#c9e6ff",
        "on-tertiary-fixed": "#410005",
        "on-primary": "#003824",
        "on-error": "#690005",
        "outline-variant": "#3c4a42",
        "on-surface": "#dde4dd",
        "secondary-fixed-dim": "#89ceff",
        "on-secondary-fixed-variant": "#004c6e",
        "inverse-surface": "#dde4dd",
        "surface-container-low": "#161d19",
        "on-error-container": "#ffdad6",
        "on-secondary": "#00344d",
        "surface-tint": "#4edea3",
        "error": "#ffb4ab",
        "on-surface-variant": "#bbcabf",
        "on-primary-container": "#00422b",
        "on-secondary-container": "#00344e",
        "surface-variant": "#2f3632",
        "tertiary": "#ffb3af",
        "tertiary-container": "#fc7c78",
        "surface-container-lowest": "#09100c",
        "primary-fixed-dim": "#4edea3",
        "surface-container-high": "#242c27",
        "surface-bright": "#343b36",
        "primary-fixed": "#6ffbbe",
        "on-primary-fixed": "#002113",
        "error-container": "#93000a",
        "tertiary-fixed": "#ffdad7",
        "on-tertiary-container": "#711419",
        "on-background": "#dde4dd",
        "outline": "#86948a",
        "background": "#0e1511",
        "secondary-container": "#00a2e6"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "md": "16px",
        "xs": "4px",
        "gutter": "16px",
        "sm": "8px",
        "margin-mobile": "16px",
        "unit": "4px",
        "margin-desktop": "32px",
        "lg": "24px",
        "xl": "40px"
      },
      fontFamily: {
        "mono-label": ["JetBrains Mono"],
        "headline-lg": ["Geist"],
        "headline-lg-mobile": ["Geist"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md": ["Geist"],
        "body-md": ["Inter"],
        "mono-code": ["JetBrains Mono"]
      },
      fontSize: {
        "mono-label": ["13px", { "lineHeight": "1.4", "letterSpacing": "0.02em", "fontWeight": "500" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "headline-lg-mobile": ["26px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "mono-code": ["14px", { "lineHeight": "1.6", "fontWeight": "400" }]
      }
    }
  },
  plugins: [
    forms,
    containerQueries
  ],
}
