/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        qiita: "#59bb0c",
      },
    },
  },
};
