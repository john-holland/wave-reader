/**
 * Error Boundary RobotCopy Pact Configuration
 * 
 * Defines the communication contracts and feature toggles for the error boundary system.
 */

module.exports = {
  // Component identification
  componentId: 'error-boundary',
  componentName: 'Error Boundary',
  componentVersion: '1.0.0',
  
  // Feature toggles
  features: {
    // Enable/disable error boundary functionality
    errorBoundaryEnabled: {
      name: 'Error Boundary Enabled',
      description: 'Master toggle for error boundary functionality',
      defaultValue: true,
      environment: 'all'
    },
    
    // Enable development mode by default
    developmentModeEnabled: {
      name: 'Development Mode Enabled',
      description: 'Show detailed error information by default',
      defaultValue: true,
      environment: 'development'
    },
    
    // Enable recovery attempts
    recoveryAttemptsEnabled: {
      name: 'Recovery Attempts Enabled',
      description: 'Allow automatic recovery from errors',
      defaultValue: true,
      environment: 'all'
    },
    
    // Maximum recovery attempts
    maxRecoveryAttempts: {
      name: 'Max Recovery Attempts',
      description: 'Maximum number of recovery attempts before giving up',
      defaultValue: 3,
      environment: 'all',
      validation: {
        type: 'number',
        min: 1,
        max: 10
      }
    },
    
    // Enable error logging
    errorLoggingEnabled: {
      name: 'Error Logging Enabled',
      description: 'Log errors to console and external systems',
      defaultValue: true,
      environment: 'all'
    },
    
    // Enable error reporting
    errorReportingEnabled: {
      name: 'Error Reporting Enabled',
      description: 'Send error reports to monitoring systems',
      defaultValue: false,
      environment: 'production'
    },
    
    // Enable custom error boundaries
    customErrorBoundariesEnabled: {
      name: 'Custom Error Boundaries Enabled',
      description: 'Allow creation of custom error boundary configurations',
      defaultValue: true,
      environment: 'all'
    },
    
    // Enable error boundary analytics
    analyticsEnabled: {
      name: 'Error Boundary Analytics',
      description: 'Track error boundary usage and performance',
      defaultValue: true,
      environment: 'all'
    }
  },
  
  // Communication contracts
  contracts: {
    // Error catching contract
    catchError: {
      name: 'Catch Error',
      description: 'Contract for catching and handling errors',
      version: '1.0.0',
      input: {
        error: {
          type: 'Error',
          required: true,
          description: 'The JavaScript error that occurred'
        },
        errorInfo: {
          type: 'ErrorInfo',
          required: false,
          description: 'Additional error information from React'
        },
        componentName: {
          type: 'string',
          required: false,
          description: 'Name of the component that errored'
        },
        timestamp: {
          type: 'string',
          required: false,
          description: 'ISO timestamp of when the error occurred'
        }
      },
      output: {
        success: {
          type: 'boolean',
          description: 'Whether the error was successfully caught'
        },
        errorBoundaryId: {
          type: 'string',
          description: 'Unique identifier for the error boundary instance'
        },
        recoveryAttempts: {
          type: 'number',
          description: 'Number of recovery attempts made'
        }
      }
    },
    
    // Recovery attempt contract
    attemptRecovery: {
      name: 'Attempt Recovery',
      description: 'Contract for attempting to recover from an error',
      version: '1.0.0',
      input: {
        errorBoundaryId: {
          type: 'string',
          required: true,
          description: 'ID of the error boundary to recover'
        },
        recoveryStrategy: {
          type: 'string',
          required: false,
          description: 'Strategy to use for recovery',
          enum: ['reset', 'retry', 'fallback']
        }
      },
      output: {
        success: {
          type: 'boolean',
          description: 'Whether recovery was successful'
        },
        recoveryMethod: {
          type: 'string',
          description: 'Method used for recovery'
        },
        attemptsRemaining: {
          type: 'number',
          description: 'Number of recovery attempts remaining'
        }
      }
    },
    
    // Error reporting contract
    reportError: {
      name: 'Report Error',
      description: 'Contract for reporting errors to external systems',
      version: '1.0.0',
      input: {
        error: {
          type: 'Error',
          required: true,
          description: 'The error to report'
        },
        context: {
          type: 'object',
          required: false,
          description: 'Additional context about the error'
        },
        severity: {
          type: 'string',
          required: false,
          description: 'Severity level of the error',
          enum: ['low', 'medium', 'high', 'critical']
        }
      },
      output: {
        reported: {
          type: 'boolean',
          description: 'Whether the error was successfully reported'
        },
        reportId: {
          type: 'string',
          description: 'Unique identifier for the error report'
        }
      }
    }
  },
  
  // State machine configuration
  stateMachine: {
    // Error boundary states
    states: {
      normal: {
        name: 'Normal',
        description: 'Error boundary is functioning normally',
        actions: ['monitor', 'log']
      },
      error: {
        name: 'Error',
        description: 'An error has been caught',
        actions: ['displayFallback', 'logError', 'attemptRecovery']
      },
      recovering: {
        name: 'Recovering',
        description: 'Attempting to recover from error',
        actions: ['recover', 'logRecovery']
      },
      maxRetriesExceeded: {
        name: 'Max Retries Exceeded',
        description: 'Maximum recovery attempts reached',
        actions: ['displayFinalFallback', 'logMaxRetries']
      },
      development: {
        name: 'Development',
        description: 'Development mode with detailed error information',
        actions: ['showDetails', 'logDevelopment']
      }
    },
    
    // Transitions between states
    transitions: {
      CATCH_ERROR: {
        from: ['normal', 'recovering'],
        to: 'error',
        description: 'An error was caught'
      },
      ATTEMPT_RECOVERY: {
        from: 'error',
        to: 'recovering',
        description: 'Attempting to recover from error'
      },
      RECOVERY_SUCCESS: {
        from: 'recovering',
        to: 'normal',
        description: 'Recovery was successful'
      },
      RECOVERY_FAILED: {
        from: 'recovering',
        to: 'error',
        description: 'Recovery attempt failed'
      },
      MAX_RETRIES_EXCEEDED: {
        from: 'error',
        to: 'maxRetriesExceeded',
        description: 'Maximum recovery attempts reached'
      },
      RESET_ERROR: {
        from: ['error', 'maxRetriesExceeded'],
        to: 'normal',
        description: 'Error state was reset'
      },
      TOGGLE_DEVELOPMENT: {
        from: ['error', 'maxRetriesExceeded'],
        to: 'development',
        description: 'Switched to development mode'
      }
    }
  },
  
  // Metrics and monitoring
  metrics: {
    // Error boundary metrics
    errorBoundaryMetrics: {
      errorsCaught: {
        name: 'Errors Caught',
        description: 'Total number of errors caught by error boundaries',
        type: 'counter',
        unit: 'errors'
      },
      recoveryAttempts: {
        name: 'Recovery Attempts',
        description: 'Total number of recovery attempts made',
        type: 'counter',
        unit: 'attempts'
      },
      successfulRecoveries: {
        name: 'Successful Recoveries',
        description: 'Number of successful recoveries from errors',
        type: 'counter',
        unit: 'recoveries'
      },
      failedRecoveries: {
        name: 'Failed Recoveries',
        description: 'Number of failed recovery attempts',
        type: 'counter',
        unit: 'failures'
      },
      errorBoundaryUptime: {
        name: 'Error Boundary Uptime',
        description: 'Time error boundaries have been active',
        type: 'gauge',
        unit: 'seconds'
      }
    },
    
    // Performance metrics
    performanceMetrics: {
      errorHandlingLatency: {
        name: 'Error Handling Latency',
        description: 'Time taken to handle and display errors',
        type: 'histogram',
        unit: 'milliseconds'
      },
      recoveryLatency: {
        name: 'Recovery Latency',
        description: 'Time taken to attempt recovery',
        type: 'histogram',
        unit: 'milliseconds'
      }
    }
  },
  
  // Configuration validation
  validation: {
    // Validate feature toggle values
    validateFeatures: (features) => {
      const errors = [];
      
      if (features.maxRecoveryAttempts < 1 || features.maxRecoveryAttempts > 10) {
        errors.push('maxRecoveryAttempts must be between 1 and 10');
      }
      
      if (typeof features.errorBoundaryEnabled !== 'boolean') {
        errors.push('errorBoundaryEnabled must be a boolean');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    },
    
    // Validate contract inputs
    validateContractInput: (contractName, input) => {
      const contract = module.exports.contracts[contractName];
      if (!contract) {
        return { valid: false, errors: [`Unknown contract: ${contractName}`] };
      }
      
      const errors = [];
      
      // Validate required fields
      Object.entries(contract.input).forEach(([fieldName, fieldConfig]) => {
        if (fieldConfig.required && !input[fieldName]) {
          errors.push(`Required field '${fieldName}' is missing`);
        }
      });
      
      // Validate enum values
      Object.entries(contract.input).forEach(([fieldName, fieldConfig]) => {
        if (fieldConfig.enum && input[fieldName] && !fieldConfig.enum.includes(input[fieldName])) {
          errors.push(`Field '${fieldName}' must be one of: ${fieldConfig.enum.join(', ')}`);
        }
      });
      
      return {
        valid: errors.length === 0,
        errors
      };
    }
  }
};
