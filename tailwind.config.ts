
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'playfair': ['"Playfair Display"', 'serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'sf-pro': ['"SF Pro Display"', 'sans-serif'],
			},
			scale: {
				'102': '1.02',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'deep-blue': '#0A1929',
				'soft-cyan': '#64DFDF',
				'soft-purple': '#8B5CF6',
				'neon-cyan': '#00F5FF',
				'modern-blue': {
					50: '#E6F1FF',
					100: '#CCE4FF',
					200: '#99C9FF',
					300: '#66ADFF',
					400: '#3392FF',
					500: '#0077FF',
					600: '#005FCC',
					700: '#004799',
					800: '#003066',
					900: '#001833',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				blob: {
					'0%': {
						transform: 'translate(0, 0) scale(1)'
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)'
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)'
					},
					'100%': {
						transform: 'translate(0, 0) scale(1)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.7',
						boxShadow: '0 0 20px 10px rgba(0, 119, 255, 0.3)'
					},
					'50%': {
						opacity: '1',
						boxShadow: '0 0 30px 15px rgba(0, 119, 255, 0.5)'
					}
				},
				'rotate-gauge': {
					'0%': { transform: 'rotate(-120deg)' },
					'100%': { transform: 'rotate(120deg)' }
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'expand': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 5s ease-in-out infinite',
				'blob': 'blob 20s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'rotate-gauge': 'rotate-gauge 2s ease-out',
				'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
				'expand': 'expand 2s ease-in-out infinite'
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'neon': '0 0 10px rgba(0, 245, 255, 0.5)'
			},
			backdropBlur: {
				'xs': '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
