// Jira-inspired Design System
export const colors = {
  // Primary colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#0052CC', // Jira blue
    600: '#0747A6',
    700: '#0052CC',
    800: '#172B4D',
    900: '#0C1E5B',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFBFC',
    100: '#F4F5F7',
    200: '#EBECF0',
    300: '#DFE1E6',
    400: '#C1C7D0',
    500: '#97A0AF',
    600: '#6B778C',
    700: '#42526E',
    800: '#172B4D',
    900: '#091E42',
  },
  
  // Status colors
  success: {
    50: '#E3FCEF',
    100: '#C1F4CD',
    200: '#A3F7B9',
    300: '#7FF0A3',
    400: '#57D9A3',
    500: '#36B37E',
    600: '#00875A',
    700: '#006644',
    800: '#004C3A',
    900: '#003D2F',
  },
  
  warning: {
    50: '#FFFAE6',
    100: '#FFF0B3',
    200: '#FFE380',
    300: '#FFD54D',
    400: '#FFC726',
    500: '#FFAB00',
    600: '#FF8B00',
    700: '#FF6B00',
    800: '#FF4D00',
    900: '#FF2E00',
  },
  
  danger: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFBFC',
    tertiary: '#F4F5F7',
    overlay: 'rgba(9, 30, 66, 0.54)',
  },
  
  // Border colors
  border: {
    primary: '#DFE1E6',
    secondary: '#C1C7D0',
    focus: '#0052CC',
  },
  
  // Text colors
  text: {
    primary: '#172B4D',
    secondary: '#6B778C',
    tertiary: '#97A0AF',
    inverse: '#FFFFFF',
    link: '#0052CC',
  },
}

export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
  },
  
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
}

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

export const borderRadius = {
  none: '0',
  sm: '2px',
  base: '3px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '12px',
  full: '9999px',
}

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(9, 30, 66, 0.08)',
  base: '0 1px 3px 0 rgba(9, 30, 66, 0.12), 0 1px 2px 0 rgba(9, 30, 66, 0.08)',
  md: '0 4px 6px -1px rgba(9, 30, 66, 0.12), 0 2px 4px -1px rgba(9, 30, 66, 0.08)',
  lg: '0 10px 15px -3px rgba(9, 30, 66, 0.12), 0 4px 6px -2px rgba(9, 30, 66, 0.08)',
  xl: '0 20px 25px -5px rgba(9, 30, 66, 0.12), 0 10px 10px -5px rgba(9, 30, 66, 0.08)',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// Common component styles
export const components = {
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: borderRadius.base,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      textDecoration: 'none',
      outline: 'none',
      '&:focus': {
        boxShadow: `0 0 0 2px ${colors.background.primary}, 0 0 0 4px ${colors.primary[200]}`,
      },
      '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
      },
    },
    variants: {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text.inverse,
        '&:hover': {
          backgroundColor: colors.primary[600],
        },
        '&:active': {
          backgroundColor: colors.primary[700],
        },
      },
      secondary: {
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
        '&:hover': {
          backgroundColor: colors.background.secondary,
        },
        '&:active': {
          backgroundColor: colors.background.tertiary,
        },
      },
      subtle: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        '&:hover': {
          backgroundColor: colors.background.secondary,
        },
        '&:active': {
          backgroundColor: colors.background.tertiary,
        },
      },
      danger: {
        backgroundColor: colors.danger[500],
        color: colors.text.inverse,
        '&:hover': {
          backgroundColor: colors.danger[600],
        },
        '&:active': {
          backgroundColor: colors.danger[700],
        },
      },
    },
    sizes: {
      sm: {
        padding: `${spacing[1]} ${spacing[2]}`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: `${spacing[2]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        padding: `${spacing[3]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
      },
    },
  },
  
  input: {
    base: {
      width: '100%',
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: borderRadius.base,
      transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      outline: 'none',
      '&:hover': {
        borderColor: colors.border.secondary,
      },
      '&:focus': {
        borderColor: colors.border.focus,
        boxShadow: `0 0 0 1px ${colors.border.focus}`,
      },
      '&:disabled': {
        backgroundColor: colors.background.secondary,
        color: colors.text.tertiary,
        cursor: 'not-allowed',
      },
    },
  },
  
  card: {
    base: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.base,
      border: `1px solid ${colors.border.primary}`,
      boxShadow: shadows.sm,
    },
  },
}

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  components,
} 