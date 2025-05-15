import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/common/ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  tryAgain = () => {
    // Reset the error state and try to re-render
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  }

  render() {
    if (this.state.hasError) {
      // Check if it's an API error
      const isApiError = this.state.error && 
        (this.state.error.message.includes('API') || 
         this.state.error.message.includes('Server') ||
         this.state.error.message.includes('Network') ||
         this.state.error.message.includes('Unauthorized'));
      
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <FontAwesomeIcon icon="exclamation-circle" />
            </div>
            <h2>Something went wrong</h2>
            
            {isApiError ? (
              <div className="api-error-message">
                <p>There was a problem connecting to the server.</p>
                <p>This could be due to:</p>
                <ul>
                  <li>Network connectivity issues</li>
                  <li>Server is temporarily unavailable</li>
                  <li>Your session may have expired</li>
                </ul>
              </div>
            ) : (
              <p>An unexpected error occurred in the application.</p>
            )}
            
            <div className="error-actions">
              <button 
                className="btn btn-primary" 
                onClick={this.tryAgain}
              >
                <FontAwesomeIcon icon="sync" /> Try Again
              </button>
              
              <button 
                className="btn btn-secondary" 
                onClick={this.toggleDetails}
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
              </button>
            </div>
            
            {this.state.showDetails && (
              <div className="error-details">
                <h3>Error Details:</h3>
                <p className="error-message">{this.state.error.toString()}</p>
                <div className="stack-trace">
                  <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render the children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
