export const themeConfig = {
  colors: {
    primary: '#4f46e5',
    accent: '#00d9ff',
    success: '#10b981',
    error: '#ff6b6b',
    warning: '#ffa500',
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#16213e'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#8b92a9'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px'
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 8px 24px rgba(0, 0, 0, 0.3)',
    lg: '0 16px 40px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(0, 217, 255, 0.3)'
  }
}

export const animations = {
  fadeIn: {
    duration: 0.3,
    easing: 'easeOut'
  },
  slideIn: {
    duration: 0.5,
    easing: 'easeOut'
  },
  scaleIn: {
    duration: 0.4,
    easing: 'easeOut'
  }
}
