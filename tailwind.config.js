/** @type {import('tailwindcss').Config} */

// Import your Colors from constants/colors.ts
const { Colors, DATE_COLORS, PROJECT_COLORS } = require("./constants/Colors");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...Colors,
        date: DATE_COLORS,
        project: PROJECT_COLORS.reduce((acc, color, idx) => {
          acc[idx + 1] = color; // naming each project color as project-1, project-2, etc.
          return acc;
        }, {}),
      },
    },
  },
  plugins: [],
};
