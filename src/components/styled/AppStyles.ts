import styled from 'styled-components';

// Add spinner animation CSS
export const SpinnerStyle = styled.div`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  &.spinner {
    animation: spin 1s linear infinite;
  }
`;

// Styled components optimized for Chrome extension popup
export const WaveReader = styled.div`
  width: 400px; // Smaller width for popup
  max-height: 600px; // Limit height for popup
  overflow-y: auto;
  font-size: 14px; // Smaller font for popup
`;

export const PopupHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  
  h1 {
    margin: 0 0 5px 0;
    font-size: 1.5rem; // Smaller for popup
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

export const PopupContent = styled.div`
  padding: 15px;
`;

export const CompactButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin: 2px;
  
  &.btn-primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
  }
  
  &.btn-success {
    background: #28a745;
    color: white;
    
    &:hover {
      background: #218838;
      transform: translateY(-1px);
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
      transform: translateY(-1px);
    }
  }
  
  &.btn-danger {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
      transform: translateY(-1px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const CompactInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

export const CompactSection = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #2c3e50;
  }
`;

export const CompactSelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 6px;
  background: white;
  font-size: 12px;
  
  .selector-text {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    color: #495057;
  }
  
  .selector-actions {
    display: flex;
    gap: 4px;
  }
`;

export interface StatusIndicatorProps {
  isActive: boolean;
}

export const StatusIndicator = styled.div<StatusIndicatorProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: ${props => props.isActive ? '#d4edda' : '#f8f9fa'};
  border: 1px solid ${props => props.isActive ? '#c3e6cb' : '#e9ecef'};
  border-radius: 4px;
  margin-bottom: 12px;
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isActive ? '#28a745' : '#6c757d'};
    animation: ${props => props.isActive ? 'pulse 1.5s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// New styled components for bifocal modal structure
export const ModalContainer = styled.div`
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StartWaveButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const StopWaveButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const CollapseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const TabNavigation = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

export const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${props => props.isActive ? 'white' : 'transparent'};
  color: ${props => props.isActive ? '#667eea' : '#6c757d'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.isActive ? '#667eea' : 'transparent'};
  
  &:hover {
    background: ${props => props.isActive ? 'white' : 'rgba(102, 126, 234, 0.05)'};
    color: #667eea;
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const HowToContent = styled.div`
  line-height: 1.6;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 16px;
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 12px;
    color: #495057;
  }
  
  .shortcut {
    background: #e9ecef;
    padding: 8px 12px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    color: #495057;
    display: inline-block;
    margin: 4px 0;
  }
`;

export const AboutContent = styled.div`
  line-height: 1.6;
  
  h3 {
    color: #2c3e50;
    margin-bottom: 16px;
    font-size: 1.2rem;
  }
  
  p {
    margin-bottom: 12px;
    color: #495057;
  }
  
  .donation-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    margin: 20px 0;
  }
  
  .donation-image {
    width: 60%;
    margin: 16px auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .donation-image img {
    width: 100%;
    height: auto;
    max-width: 300px;
    display: block;
  }
  
  .address {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    color: #6c757d;
    word-break: break-all;
  }
`;

