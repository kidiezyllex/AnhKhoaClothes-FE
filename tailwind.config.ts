// Import kiểu dữ liệu Config từ tailwindcss
import type { Config } from 'tailwindcss'

// Import plugin từ Tailwind để mở rộng tiện ích
const plugin = require('tailwindcss/plugin')

// Import font mặc định từ Tailwind
const { fontFamily } = require('tailwindcss/defaultTheme')

// Khai báo cấu hình Tailwind
const config: Config = {
  // Kích hoạt chế độ dark mode dựa theo class 'dark'
  darkMode: ['class'],

  // Xác định các tệp cần quét class Tailwind
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // Trang
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',  // Component
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',         // App root
  ],

  // Phần cấu hình theme
  theme: {
    // Khai báo các kích thước màn hình responsive
    screens: {
      xs: '360px',
      sm: '568px',
      md: '768px',
      lg: '992px',
      xl: '1280px',
      xxl: '1560px',
      xxxl: '1920px',
    },

    // Phần mở rộng thêm cho theme
    extend: {
      // Cấu hình font chữ
      fontFamily: {
        sans: [
          'var(--font-manrope)',     // Font custom Manrope
          'Amazon Ember',            // Font phụ
          ...fontFamily.sans         // Font mặc định Tailwind
        ],
        manrope: ['var(--font-manrope)'], // Alias riêng
      },

      // Trọng số font chữ
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      // Bóng đổ
      boxShadow: {
        'light-grey': '0 4px 6px rgba(211, 211, 211, 0.6)',
      },

      // Ảnh nền gradient
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Màu sắc tùy chỉnh
      colors: {
        primary: {
          DEFAULT: '#2C8B3D',                        // Xanh lá chính
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: '#88C140',                        // Xanh lá nhạt
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: '#FDFDFD',                        // Nền trắng
        extra: '#F2A024',                             // Cam phụ
        active: '#F2A024',                            // Cam khi active
        maintext: '#374151',                          // Màu chữ chính
        'main-dark-blue': '#131921',
        'main-charcoal-blue': '#232F3E',
        'main-gunmetal-blue': '#252C35',
        'main-golden-orange': '#FCAF17',
        'main-text': '#0F172A',
        'gray-light': '#7579E70D',
        'gray-dark': '#636364',
        'border-primary': '#DCDCDC',
        'border-second': '#D9D9D9',
        'white-primary': '#ffffff',
        'black-dark': '#000000',
        'light-black': '#716F7E',
        'medium-grey': '#AAAAAA',
        'green-medium': '#0D961B',
        'red-medium': '#E73D30',
        'main-purple': '#691577',
        'red-error': '#FF4D4F',
        'blue-dark': '#6366F1',
        'orange-medium': '#FAAD14',
        'blue-medium': '#005884',
        'blue-darker': '#1677FF',

        // Biến hsl (dùng trong dark/light mode)
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Màu biểu đồ
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        // Sidebar layout
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      // Font size mở rộng
      fontSize: {
        '16': '1rem',        // 16px
        '34': '2.125em',     // ~34px
      },

      // Chiều rộng tùy chỉnh
      width: {
        '100': '6.25em',
        '200': '12.5em',
        '300': '18.75em',
        '400': '25em',
        '500': '31.25em',
      },
      maxWidth: {
        '100': '6.25em',
        '200': '12.5em',
        '300': '18.75em',
        '400': '25em',
        '500': '31.25em',
      },
      minWidth: {
        '100': '6.25em',
        '200': '12.5em',
        '300': '18.75em',
        '400': '25em',
        '500': '31.25em',
      },

      // Bo góc mở rộng
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Keyframes animation
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'logo-cloud': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - 4rem))' },
        },
      },

      // Gán tên animation
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'logo-cloud': 'logo-cloud 30s linear infinite',
      },
    },
  },

  // Khai báo plugins sử dụng
  plugins: [
    // Thêm tiện ích custom scrollbar
    plugin(function ({ addUtilities }: any) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: '1px',
          scrollbarColor: '#c1c1c1',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': { width: '2px' },
          '&::-webkit-scrollbar-track': { background: 'white' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(31 41 55)',
            borderRadius: '20px',
            border: '1px solid white',
          },
        },
      };

      // Thêm các tiện ích này cho responsive & hover
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),

    // Plugin hỗ trợ hiệu ứng animation
    require("tailwindcss-animate"),
  ],
}

// Export cấu hình Tailwind
export default config;
