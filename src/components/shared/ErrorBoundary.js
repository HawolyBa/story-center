import React, { Component } from 'react' 
import * as Sentry from '@sentry/browser';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, eventId: null };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope(scope => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({eventId})
      });
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex fc jc ac" style={{height: '100%', background: 'white'}}>
                    <h2>Something went wrong</h2>
                    <button className="custom-btn" onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary