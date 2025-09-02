import React, { FunctionComponent, useEffect, useRef, useState, ReactNode } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useWaveReaderMessageRouter } from "./structural/useWaveReaderMessageRouter";

type SelectorProps = {
    going: boolean,
    onGo: () => void
    onStop: () => void
}

export const Go = styled(Button)`
    height: 4rem;
    width: 8rem;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    text-transform: uppercase;
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
    }
    
    &.inactive {
        background: #f8f9fa;
        color: #6c757d;
        border: 2px solid #dee2e6;
    }
    
    &.ready {
        background: #28a745;
        color: white;
        border: none;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

const WaveTypography = styled.h2`
  display: inline;
  font-size: 5rem!important;
  margin-right: 0.1rem;
  border-right: 0.1rem transparent;
  border-radius: 1rem;
  transition: font-size 3s;
  
  .wave {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 1em;
    height: 1em;
    display: inline-block;
    fill: currentColor;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  
  .shrink {
    font-size: 2rem;
    transition: font-size 12s;
  }
`;

type WaveProps = {
    children?: ReactNode | any
}

const WaveSymbol = ({ children }: WaveProps) => {
    return <WaveTypography>{children}</WaveTypography>;
}

// Enhanced GoButton with structural system integration
const GoButtonEnhanced: FunctionComponent<SelectorProps> = ({ going, onGo, onStop }: SelectorProps) => {
    const [goDisplayText, setGoDisplayText] = useState('go!');
    const [buttonState, setButtonState] = useState<'inactive' | 'active' | 'ready' | 'clicked'>('inactive');
    const [isEnabled, setIsEnabled] = useState(false);
    const goButtonRef = useRef<HTMLElement | null>();

    // Initialize message router
    const {
        isConnected,
        startWaveReader,
        stopWaveReader,
        enableGoButton,
        disableGoButton,
        messageStats,
        lastError,
        healthCheck
    } = useWaveReaderMessageRouter({
        componentName: 'go-button',
        autoProcess: true,
        enableMetrics: true,
        onError: (error) => {
            console.error('🌊 GoButton: Message router error:', error);
        }
    });

    // Update button state based on going prop and message router connection
    useEffect(() => {
        if (going) {
            setGoDisplayText("waving"); // 🌊
            setButtonState('active');
        } else {
            setGoDisplayText("go!");
            setButtonState(isEnabled ? 'ready' : 'inactive');
        }
    }, [going, isEnabled]);

    // Enable/disable button based on selector availability
    useEffect(() => {
        if (isConnected) {
            // Check if selector is ready (this would come from selector input component)
            // For now, we'll enable it by default when connected
            setIsEnabled(true);
            enableGoButton();
        } else {
            setIsEnabled(false);
            disableGoButton();
        }
    }, [isConnected, enableGoButton, disableGoButton]);

    // Add shrink animation effect
    useEffect(() => {
        if ((goButtonRef.current as HTMLElement | null) !== null) {
            setTimeout(() => {
                (goButtonRef.current as unknown as HTMLElement).classList.add("shrink");
            }, 0);
        }
    }, [goButtonRef]);

    // Handle button click with structural system integration
    const goClicked = async () => {
        if (!isConnected) {
            console.warn('🌊 GoButton: Message router not connected, using fallback');
            // Fallback to original behavior
            if (going) {
                onStop();
            } else {
                onGo();
            }
            return;
        }

        try {
            if (going) {
                // Stop wave reading
                console.log('🌊 GoButton: Stopping wave reader');
                const result = await stopWaveReader();
                
                if (result.success) {
                    onStop();
                    setButtonState('ready');
                    console.log('🌊 GoButton: Wave reader stopped successfully');
                } else {
                    console.error('🌊 GoButton: Failed to stop wave reader:', result.error);
                }
            } else {
                // Start wave reading
                console.log('🌊 GoButton: Starting wave reader');
                const result = await startWaveReader();
                
                if (result.success) {
                    onGo();
                    setButtonState('active');
                    console.log('🌊 GoButton: Wave reader started successfully');
                } else {
                    console.error('🌊 GoButton: Failed to start wave reader:', result.error);
                }
            }
        } catch (error) {
            console.error('🌊 GoButton: Error during wave reader operation:', error);
            // Fallback to original behavior
            if (going) {
                onStop();
            } else {
                onGo();
            }
        }
    };

    // Health check button (for debugging)
    const handleHealthCheck = async () => {
        try {
            const health = await healthCheck();
            console.log('🌊 GoButton: Health check result:', health);
        } catch (error) {
            console.error('🌊 GoButton: Health check failed:', error);
        }
    };

    // Get button class based on state
    const getButtonClass = () => {
        if (buttonState === 'active') return 'active';
        if (buttonState === 'ready') return 'ready';
        if (buttonState === 'clicked') return 'clicked';
        return 'inactive';
    };

    return (
        <div>
            <Go 
                variant="outlined" 
                startIcon={
                    <WaveSymbol>
                        <span className={'wave'} ref={el => goButtonRef.current = el}>🌊</span>
                    </WaveSymbol>
                }
                type={"button"} 
                onClick={goClicked}
                className={getButtonClass()}
                disabled={!isConnected || !isEnabled}
            >
                {goDisplayText}
            </Go>
            
            {/* Debug information (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                    <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
                    <div>Button State: {buttonState}</div>
                    <div>Enabled: {isEnabled ? 'Yes' : 'No'}</div>
                    {lastError && <div style={{ color: '#dc3545' }}>Error: {lastError}</div>}
                    <div>Messages: {messageStats.totalMessages}</div>
                    <div>Success Rate: {messageStats.successRate.toFixed(1)}%</div>
                    <button 
                        onClick={handleHealthCheck}
                        style={{ 
                            fontSize: '10px', 
                            padding: '2px 6px', 
                            marginTop: '5px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        Health Check
                    </button>
                </div>
            )}
        </div>
    );
}

export default GoButtonEnhanced;
