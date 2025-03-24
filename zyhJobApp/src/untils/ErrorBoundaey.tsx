import React, { Component } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你也可以将错误日志记录到错误报告服务中
    console.error("捕获到一个错误:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI
      return (
        <div className="error-boundary">
        <h1>Something went wrong.</h1>
        <p>{this.state.errorMessage}</p>
        <button onClick={this.handleRetry}>Try again</button>
      </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;