import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

/*const pallet = {
  "amarnath": {
    50: "#FCE8EE",
    100: "#FAD1DC",
    200: "#F4A4B9",
    300: "#EF7193",
    400: "#E94470",
    500: "#E01A4F",
    600: "#B2153F",
    700: "#850F2F",
    800: "#5B0B20",
    900: "#2E0510",
    950: "#170308"
  },
  "green": {
    50: "#EBFFF5",
    100: "#D2FEE8",
    200: "#A4FED1",
    300: "#77FDBA",
    400: "#4FFDA6",
    500: "#20FC8F",
    600: "#03E273",
    700: "#02A654",
    800: "#026F38",
    900: "#01371C",
    950: "#001E0F"
  },
  "oxford": {
    50: "#DEE5F7",
    100: "#B9C7EE",
    200: "#7390DD",
    300: "#325BCD",
    400: "#213C87",
    500: "#101D42",
    600: "#0D1835",
    700: "#0A1229",
    800: "#060B19",
    900: "#03050C",
    950: "#020408"
  },
  "cadet": {
    50: "#E6E7F0",
    100: "#CCCFE0",
    200: "#999EC1",
    300: "#676EA3",
    400: "#43486F",
    500: "#25283D",
    600: "#1D1F30",
    700: "#171926",
    800: "#0F1119",
    900: "#08080D",
    950: "#040406"
  },
  "onyx": {
    50: "#E9EBEC",
    100: "#D6D9DB",
    200: "#ADB4B8",
    300: "#828C91",
    400: "#5D656A",
    500: "#393E41",
    600: "#2D3134",
    700: "#212426",
    800: "#181A1B",
    900: "#0C0D0E",
    950: "#050505"
  },
  "backg": {
    50: "#E8EBED",
    100: "#D5D9DD",
    200: "#A8B0B8",
    300: "#7E8A96",
    400: "#57616B",
    500: "#343A40",
    600: "#292E33",
    700: "#202427",
    800: "#151719",
    900: "#0B0D0E",
    950: "#050506"
  },
  "primary": {
    50: "#F1F2F3",
    100: "#E1E3E5",
    200: "#C3C7CB",
    300: "#A5ABB1",
    400: "#899299",
    500: "#6C757D",
    600: "#575F65",
    700: "#40454A",
    800: "#2B2E31",
    900: "#151719",
    950: "#0C0D0E"
  }
};*/



const config: Config = {
  darkMode: ["class"],
	content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,svelte,ts}"
  ],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / 100%)",
				input: "hsl(var(--input) / 100%)",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background) / 100%)",
				foreground: "hsl(var(--foreground) / 100%)",
				primary: {
					DEFAULT: "hsl(var(--primary) / 100%)",
					foreground: "hsl(var(--primary-foreground) / 100%)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / 100%)",
					foreground: "hsl(var(--secondary-foreground) / 100%)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / 100%)",
					foreground: "hsl(var(--destructive-foreground) / 100%)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / 100%)",
					foreground: "hsl(var(--muted-foreground) / 100%)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / 100%)",
					foreground: "hsl(var(--accent-foreground) / 100%)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / 100%)",
					foreground: "hsl(var(--popover-foreground) / 100%)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / 100%)",
					foreground: "hsl(var(--card-foreground) / 100%)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["geist-sans", ...fontFamily.sans],
			},
		},
	},
  plugins: [require("tailwindcss-animate")],
};

export default config;
