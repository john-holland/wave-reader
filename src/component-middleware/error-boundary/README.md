# Error Boundary Component Middleware

A comprehensive error boundary system for wave-reader that follows the component-middleware pattern and provides advanced error handling capabilities.

## Overview

The Error Boundary Component Middleware provides a robust, state-driven approach to handling JavaScript errors in React components. It integrates with the existing wave-reader architecture while maintaining backward compatibility.

## Features

- **State Machine Integration**: Uses XState for managing error boundary states
- **Recovery Mechanisms**: Automatic and manual error recovery with configurable attempts
- **Development Mode**: Enhanced debugging information in development environments
- **Generic Editor Styling**: Consistent UI using the modern generic editor design system
- **RobotCopy Integration**: Feature toggles and communication contracts
- **Metrics & Monitoring**: Built-in performance and error tracking
- **Responsive Design**: Mobile-first approach with dark mode support

## Architecture

### Component Structure

```
error-boundary/
├── templates/
│   └── error-boundary-component/
│       ├── index.js              # Main template with XState machine
│       ├── styles.css            # Component-specific styles
│       └── views/                # View templates for different states
├── ErrorBoundaryTomes.tsx        # React integration layer
├── robotcopy-pact-config.js      # Feature toggles and contracts
└── README.md                     # This documentation
```

### State Machine States

1. **`normal`**: Error boundary is functioning normally
2. **`error`**: An error has been caught and fallback UI is displayed
3. **`recovering`**: Attempting to recover from the error
4. **`maxRetriesExceeded`**: Maximum recovery attempts reached
5. **`development`**: Development mode with detailed error information

### State Transitions

- `CATCH_ERROR` → `error`
- `ATTEMPT_RECOVERY` → `recovering`
- `RECOVERY_SUCCESS` → `normal`
- `RECOVERY_FAILED` → `error`
- `MAX_RETRIES_EXCEEDED` → `maxRetriesExceeded`
- `RESET_ERROR` → `normal`
- `TOGGLE_DEVELOPMENT` → `development`

## Usage

### Basic Usage

```tsx
import { ErrorBoundary } from '../components/error-boundary';

function MyComponent() {
  return (
    <ErrorBoundary componentName="MyComponent">
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### Advanced Configuration

```tsx
import { ErrorBoundary } from '../components/error-boundary';

function MyComponent() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.log('Error caught:', error);
    // Send to error reporting service
  };

  const handleRecovery = (attempts: number) => {
    console.log(`Recovery attempt ${attempts}`);
  };

  return (
    <ErrorBoundary
      componentName="MyComponent"
      maxRecoveryAttempts={5}
      onError={handleError}
      onRecovery={handleRecovery}
      enableDevelopmentMode={true}
      customErrorBoundaryId="my-component-error-boundary"
    >
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### Using the Modern Error Boundary Directly

```tsx
import { ModernErrorBoundary } from '../components/error-boundary';

function MyComponent() {
  return (
    <ModernErrorBoundary
      componentName="MyComponent"
      maxRecoveryAttempts={3}
    >
      <ComponentThatMightError />
    </ModernErrorBoundary>
  );
}
```

### Higher-Order Component

```tsx
import { withErrorBoundary } from '../components/error-boundary';

const MyComponentWithErrorBoundary = withErrorBoundary(MyComponent, {
  componentName: 'MyComponent',
  maxRecoveryAttempts: 3
});
```

### Hook for Functional Components

```tsx
import { useErrorBoundary } from '../components/error-boundary';

function MyFunctionalComponent() {
  const { hasError, error, catchError, resetError } = useErrorBoundary();

  if (hasError) {
    return (
      <div>
        <p>Something went wrong: {error?.message}</p>
        <button onClick={resetError}>Try Again</button>
      </div>
    );
  }

  return <ComponentThatMightError />;
}
```

### Utility Function

```tsx
import { createErrorBoundary } from '../components/error-boundary';

const CustomErrorBoundary = createErrorBoundary({
  componentName: 'CustomComponent',
  maxRecoveryAttempts: 5,
  enableDevelopmentMode: true
});

function MyComponent() {
  return (
    <CustomErrorBoundary>
      <ComponentThatMightError />
    </CustomErrorBoundary>
  );
}
```

## Configuration

### Feature Toggles

The system includes several feature toggles that can be configured:

- `errorBoundaryEnabled`: Master toggle for error boundary functionality
- `developmentModeEnabled`: Show detailed error information by default
- `recoveryAttemptsEnabled`: Allow automatic recovery from errors
- `maxRecoveryAttempts`: Maximum number of recovery attempts (1-10)
- `errorLoggingEnabled`: Log errors to console and external systems
- `errorReportingEnabled`: Send error reports to monitoring systems
- `customErrorBoundariesEnabled`: Allow custom error boundary configurations
- `analyticsEnabled`: Track error boundary usage and performance

### RobotCopy Contracts

The system defines several communication contracts:

1. **`catchError`**: Contract for catching and handling errors
2. **`attemptRecovery`**: Contract for attempting to recover from errors
3. **`reportError`**: Contract for reporting errors to external systems

## Styling

### CSS Classes

The component uses a comprehensive set of CSS classes:

- `.generic-editor.error-editor`: Base error editor layout
- `.error-boundary-normal`: Normal state styling
- `.error-boundary-recovering`: Recovery state styling
- `.error-content`: Error content container
- `.error-actions`: Action buttons container
- `.error-details`: Collapsible error details
- `.error-stack`: Error stack trace display

### Responsive Design

- Mobile-first approach with breakpoints at 768px and 480px
- Adaptive layouts for different screen sizes
- Touch-friendly button sizes and spacing

### Dark Mode Support

- Automatic theme switching based on system preferences
- Optimized color schemes for dark environments
- Maintains accessibility in all themes

## Error Recovery

### Recovery Strategies

1. **Automatic Recovery**: Attempts to reset the component state
2. **Manual Recovery**: User-initiated recovery through UI buttons
3. **Progressive Fallback**: Multiple fallback levels based on error severity

### Recovery Attempts

- Configurable maximum attempts (default: 3)
- Exponential backoff between attempts
- User feedback on remaining attempts
- Final fallback when max attempts reached

## Development Mode

### Enhanced Debugging

- Detailed error information display
- Component stack traces
- Error boundary state information
- Recovery attempt history
- Performance metrics

### Development Tools

- Toggle development mode on/off
- Expandable error details
- Component state inspection
- Error boundary configuration

## Metrics and Monitoring

### Built-in Metrics

- Errors caught count
- Recovery attempts count
- Successful recoveries count
- Failed recoveries count
- Error boundary uptime
- Error handling latency
- Recovery latency

### Integration Points

- Console logging for development
- External monitoring system support
- Performance tracking
- Error reporting services

## Backward Compatibility

The system maintains full backward compatibility with existing error boundary usage:

- Same component API
- Same error handling behavior
- Gradual migration path
- Legacy component support

## Migration Guide

### From Legacy Error Boundary

1. **No Changes Required**: Existing code continues to work
2. **Optional Enhancement**: Add new props for advanced features
3. **Gradual Migration**: Use new features as needed

### To Modern Error Boundary

1. **Import Change**: Use `ModernErrorBoundary` instead of `ErrorBoundary`
2. **Enhanced Props**: Take advantage of new configuration options
3. **State Management**: Leverage XState integration for complex scenarios

## Testing

### Error Simulation

The system includes built-in error simulation capabilities:

```tsx
import { ErrorTestComponent } from '../components/ErrorTestComponent';

function TestPage() {
  return (
    <ErrorBoundary>
      <ErrorTestComponent />
    </ErrorBoundary>
  );
}
```

### Test Scenarios

- Render errors
- Runtime errors
- Async errors
- Recovery attempts
- Maximum retries
- Development mode

## Performance Considerations

### Optimization Features

- Lazy loading of error details
- Conditional rendering based on state
- Efficient state updates
- Minimal re-renders
- Memory leak prevention

### Best Practices

- Use appropriate `maxRecoveryAttempts` values
- Enable development mode only when needed
- Monitor error boundary performance
- Implement appropriate error reporting
- Use custom error boundaries for specific components

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure correct import paths
2. **Styling Issues**: Check CSS class availability
3. **State Management**: Verify XState configuration
4. **Recovery Failures**: Check component error handling

### Debug Mode

Enable debug mode by setting `enableDevelopmentMode={true}` to get detailed error information and component state details.

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies
3. Run tests
4. Make changes
5. Submit pull request

### Code Style

- Follow existing TypeScript patterns
- Use consistent naming conventions
- Include comprehensive documentation
- Add appropriate tests

## License

This component is part of the wave-reader project and follows the same licensing terms.
