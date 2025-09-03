import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-paper-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-paper-100 rounded-2xl p-8 text-center ink-border panel-shadow">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              
              <h2 className="font-display text-2xl text-ink-900 mb-2">
                Oops! Something went wrong
              </h2>
              
              <p className="text-ink-700 mb-6">
                Don't worry, even the best anime have plot holes. Let's try again!
              </p>
              
              <button
                onClick={this.handleRetry}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <RefreshCw size={18} />
                <span>Try Again</span>
              </button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-ink-700 cursor-pointer">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-error bg-error/5 p-3 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
