import type { Config } from 'tailwindcss';


const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	fontFamily: {
  		sans: [
  			'Inter',
  			'sans-serif'
  		],
  		mono: [
  			'Roboto Mono',
  			'monospace'
  		],
  		nothing: [
  			'Nothing',
  			'sans-serif'
  		]
  	},
  	extend: {
  		fontSize: {
  			'2xs': [
  				'0.7rem',
  				{
  					lineHeight: '0.7rem'
  				}
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: {
  				DEFAULT: 'hsl(var(--tertiary))',
  				foreground: 'hsl(var(--tertiary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
  			'gradient-radial-at-t': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
  			'gradient-radial-at-b': 'radial-gradient(circle at bottom, var(--tw-gradient-stops))',
  			'gradient-radial-at-l': 'radial-gradient(circle at left, var(--tw-gradient-stops))',
  			'gradient-radial-at-r': 'radial-gradient(circle at right, var(--tw-gradient-stops))',
  			'gradient-radial-at-tl': 'radial-gradient(circle at top left, var(--tw-gradient-stops))',
  			'gradient-radial-at-tr': 'radial-gradient(circle at top right, var(--tw-gradient-stops))',
  			'gradient-radial-at-bl': 'radial-gradient(circle at bottom left, var(--tw-gradient-stops))',
  			'gradient-radial-at-br': 'radial-gradient(circle at bottom right, var(--tw-gradient-stops))',
  			'grid-pattern': 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
  			'grid-pattern-light': 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)'
  		},
  		animation: {
			'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
			'star-movement-top': 'star-movement-top linear infinite alternate',
			shine: "shine var(--duration) infinite linear",
		  },
		  keyframes: {
			'star-movement-bottom': {
			  '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
			  '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
			},
			'star-movement-top': {
			  '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
			  '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
			},
			shine: {
				"0%": {
				  "background-position": "0% 0%",
				},
				"50%": {
				  "background-position": "100% 100%",
				},
				to: {
				  "background-position": "0% 0%",
				},
			  },
		  },

  		maxWidth: {
  			'8xl': '90rem',
  			'9xl': '95rem',
  			'10xl': '100rem'
  		}
  	}
  },
  plugins: [
    require('tailwindcss-animate')
  ],
};

export default config;
