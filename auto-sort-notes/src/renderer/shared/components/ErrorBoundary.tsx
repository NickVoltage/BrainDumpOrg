/**
 * Error Boundary Component
 * 
 * Purpose: React error boundary to catch and handle React component errors.
 * Prevents the entire application from crashing when a component throws an error.
 * 
 * Last Updated: 2024
 * Status: Placeholder - Ready for implementation
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toAppError } from '../utils/errors';

// Comment 006: Error Boundary for React Components
// This component catches JavaScript errors anywhere in the React component tree,
// logs those errors, and displays a fallback UI instead of crashing the entire app.
//
// Intended Interactions:
// - Used by: App.tsx to wrap the entire application
// - Used by: Feature components to catch errors in specific features
// - Catches: React component errors during rendering, lifecycle methods, constructors
//
// Logic Flow:
// 1. Component throws an error during render or lifecycle
// 2. Error boundary catches the error
// 3. Error is logged via logger (Comment 008)
// 4. Fallback UI is displayed to user
// 5. User can retry or navigate away
//
// Dependencies:
// - React error boundary API (class component required)
// - src/renderer/shared/utils/errors.ts (error handling)
// - src/renderer/shared/utils/logger.ts (error logging)
//
// Related Files:
// - src/renderer/App.tsx (wraps application)
// - src/renderer/shared/utils/errors.ts (error classes)
// - src/renderer/shared/utils/logger.ts (logging)
//
// Related Comments:
// - Comment 005 (errors.ts - custom error classes)
// - Comment 007 (error-handler.ts - global error handler)
// - Comment 008 (logger.ts - logging infrastructure)

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error
    const appError = toAppError(error);
    console.error('ErrorBoundary caught an error:', appError, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo!);
      }
      
      // Default fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <details style={{ marginTop: '10px', textAlign: 'left' }}>
            <summary>Error details</summary>
            <pre>{this.state.error.stack}</pre>
            {this.state.errorInfo && (
              <pre>{this.state.errorInfo.componentStack}</pre>
            )}
          </details>
          <button onClick={this.handleReset} style={{ marginTop: '10px' }}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

