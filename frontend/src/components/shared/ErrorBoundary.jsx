/**
 * ErrorBoundary - Catches and displays errors gracefully
 */

import React, { Component } from 'react';
import { colors, spacing, typography } from '../../design/designSystem';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button style={styles.button} onClick={this.handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    padding: spacing[6],
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: '1.5rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    margin: `0 0 ${spacing[3]} 0`,
  },
  message: {
    fontFamily: typography.fontFamily.body,
    fontSize: '1rem',
    color: colors.neutral[600],
    margin: `0 0 ${spacing[6]} 0`,
    lineHeight: 1.6,
  },
  details: {
    marginBottom: spacing[6],
    textAlign: 'left',
  },
  summary: {
    cursor: 'pointer',
    fontFamily: typography.fontFamily.body,
    fontSize: '0.875rem',
    color: colors.neutral[500],
    marginBottom: spacing[2],
  },
  errorText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: '0.75rem',
    backgroundColor: colors.neutral[100],
    padding: spacing[3],
    borderRadius: '8px',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  button: {
    backgroundColor: colors.primary[500],
    color: colors.neutral[0],
    border: 'none',
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: '12px',
    fontFamily: typography.fontFamily.display,
    fontSize: '1rem',
    fontWeight: typography.fontWeight.semibold,
    cursor: 'pointer',
  },
};

export default ErrorBoundary;
