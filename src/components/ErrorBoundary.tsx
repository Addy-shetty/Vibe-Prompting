import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
    
    // You could send to error tracking service here
    // e.g., Sentry.captureException(error)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neo-bg p-6">
          <div className="max-w-md w-full bg-white border-3 border-black rounded-neo shadow-neo p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-neo-pink rounded-full flex items-center justify-center border-3 border-black">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">
              Oops! Something went wrong
            </h1>

            {/* Message */}
            <p className="font-mono font-bold text-neutral-600 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-100 border-2 border-neutral-300 rounded-neo text-left overflow-auto max-h-40">
                <p className="font-mono text-sm text-red-600 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-6 py-3 bg-neo-blue text-white font-black uppercase border-3 border-black rounded-neo shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Reload
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black uppercase border-3 border-black rounded-neo shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>

            {/* Support text */}
            <p className="mt-6 text-sm font-mono text-neutral-500">
              If this keeps happening, please{' '}
              <a
                href="https://github.com/Addy-shetty/Vibe-Prompting/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neo-blue underline hover:text-neo-pink"
              >
                report the issue
              </a>
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
