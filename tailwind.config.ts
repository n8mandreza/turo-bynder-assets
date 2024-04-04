import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#FFF',
      blurple: {
        25: '#FDFBFF',
        50: '#F9F4FF',
        75: '#F2E9FF',
        100: '#E0CAFF',
        200: '#C8ACFF',
        300: '#8D6AFF',
        400: '#593CFB',
        500: '#4A18DC',
        600: '#470AB4',
        700: '#3F0087',
        750: '#320173',
        800: '#25025F',
        850: '#15014F',
        900: '#0A013D',
        950: '#010224',
      },
      blurpleA: {
        25: '#F3F4FF',
        50: '#E6E8FF',
        75: '#D9DCFF',
        100: '#CCCEFF',
        200: '#9B9BFF',
        300: '#7A76FF',
        400: '#675CFF',
        500: '#5D4AFF',
        600: '#593CFB',
        700: '#4C30E1',
        750: '#4029C4',
        800: '#3521A6',
        850: '#261879',
        900: '#180F4D',
        950: '#0C0826',
      },
      grey: {
        25: '#fbfbfb',
        50: '#f4f4f4',
        75: '#ededed',
        100: '#e7e7e8',
        200: '#d0d0d0',
        300: '#a0a0a0',
        400: '#898989',
        500: '#767677',
        600: '#59595b',
        700: '#414143',
        750: '#373739',
        800: '#2a2a2c',
        850: '#1e1e1f',
        900: '#121214',
        950: '#070708',
      },
      green: {
        25: '#F9FFFC',
        50: '#F1FFF9',
        75: '#DCF7EA',
        100: '#A9FAD8',
        200: '#6CF6BC',
        300: '#19E194',
        400: '#08BA7A',
        500: '#0E865C',
        600: '#01764D',
        700: '#015236',
        750: '#014B35',
        800: '#014333',
        850: '#01382A',
        900: '#012C21',
        950: '#002118',
      },
      yellow: {
        25: '#FFFEFB',
        50: '#FFFBF2',
        75: '#FFF4E1',
        100: '#FFEABD',
        200: '#FFD992',
        300: '#FFB144',
        400: '#ED910F',
        500: '#D37900',
        600: '#AF6100',
        700: '#874800',
        750: '#6B3A0F',
        800: '#4C2C14',
        850: '#402411',
        900: '#331E0E',
        950: '#26160A',
      },
      red: {
        25: '#FFFCFB',
        50: '#FFF3EE',
        75: '#FFE7E3',
        100: '#FFDACC',
        200: '#FFC4AF',
        300: '#FF8F6C',
        400: '#FF493F',
        500: '#DF1920',
        600: '#B50A0D',
        700: '#870000',
        750: '#750D01',
        800: '#661301',
        850: '#591101',
        900: '#4F0F01',
        950: '#380B01',
      },
      blue: {
        25: '#F6FCFF',
        50: '#EDF8FE',
        75: '#DBF1FE',
        100: '#B7E1FC',
        200: '#7ABEF8',
        300: '#4E9EF2',
        400: '#3082E8',
        500: '#1B69DA',
        600: '#0E53C4',
        700: '#063FA2',
        750: '#04348C',
        800: '#022A75',
        850: '#011F59',
        900: '#00153E',
        950: '#000A1F',
      },
    },
    textColor: ({theme}) => ({
      DEFAULT: theme('colors.grey.75'),
      muted: theme('colors.grey.300'),
      subtle: theme('colors.grey.400'),
      ...theme('colors')
    }),
    backgroundColor: ({theme}) => ({
      DEFAULT: theme('colors.grey.900'),
      subtle: theme('colors.grey.850'),
      muted: theme('colors.grey.800'),
      inset: theme('colors.grey.950'),
      critical: theme('colors.red.950'),
      ...theme('colors')
    }),
    borderColor: ({theme}) => ({
      DEFAULT: theme('colors.grey.750'),
      accent: theme('colors.blurpleA.300'),
      ...theme('colors')
    }),
    extend: {},
  },
  plugins: []
} satisfies Config

