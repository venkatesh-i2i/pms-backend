import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../store/slices/authSlice'
import { colors, typography, spacing, shadows, borderRadius } from '../../styles/theme'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (!result.error) {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke={colors.primary[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={styles.title}>Welcome to PMS Tool</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <div style={styles.formContainer}>
          {error && (
            <div style={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.errorIcon}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email address
              </label>
              <div style={styles.inputWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.inputIcon}>
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  style={{
                    ...styles.input,
                    ...(errors.email && styles.inputError)
                  }}
                />
              </div>
              {errors.email && (
                <span style={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.inputIcon}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  style={{
                    ...styles.input,
                    ...(errors.password && styles.inputError)
                  }}
                />
              </div>
              {errors.password && (
                <span style={styles.errorText}>{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.spinner}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.submitIcon}>
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in
                </>
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              By signing in, you agree to our{' '}
              <a href="#" style={styles.footerLink}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  content: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    width: '100%',
    maxWidth: '400px',
    overflow: 'hidden',
  },
  logoSection: {
    backgroundColor: colors.primary[50],
    padding: spacing[8],
    textAlign: 'center',
    borderBottom: `1px solid ${colors.border.primary}`,
  },
  logo: {
    marginBottom: spacing[4],
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: `0 0 ${spacing[2]} 0`,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    margin: 0,
  },
  formContainer: {
    padding: spacing[8],
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.danger[50],
    color: colors.danger[700],
    padding: spacing[3],
    borderRadius: borderRadius.base,
    marginBottom: spacing[4],
    fontSize: typography.fontSize.sm,
  },
  errorIcon: {
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing[3],
    color: colors.text.tertiary,
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: `${spacing[3]} ${spacing[3]} ${spacing[3]} ${spacing[8]}`,
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
  inputError: {
    borderColor: colors.danger[500],
    '&:focus': {
      borderColor: colors.danger[500],
      boxShadow: `0 0 0 1px ${colors.danger[500]}`,
    },
  },
  errorText: {
    color: colors.danger[600],
    fontSize: typography.fontSize.sm,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    width: '100%',
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  submitIcon: {
    flexShrink: 0,
  },
  spinner: {
    flexShrink: 0,
    animation: 'spin 1s linear infinite',
  },
  footer: {
    marginTop: spacing[6],
    textAlign: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  },
  footerLink: {
    color: colors.text.link,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}

export default LoginForm 