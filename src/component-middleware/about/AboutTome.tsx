import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { createViewStateMachine, MachineRouter } from 'log-view-machine';
import { QRCodeSVG } from 'qrcode.react';
import EditorWrapper from '../../app/components/EditorWrapper';
import { AppTome } from '../../app/tomes/AppTome';
import { safeGraphQLRequest } from '../../utils/backend-api-wrapper';
import PuppyTome from '../puppies/PuppyTome';
import { FeatureToggleService, FEATURE_TOGGLES } from '../../config/feature-toggles';

// Styled components for the Tomes-based about page
const AboutView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  line-height: 1.6;
  color: #333;
`;

const AboutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const AboutTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const AboutContent = styled.div`
  padding: 24px;
  min-height: 200px;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
`;

const SectionText = styled.p`
  margin-bottom: 12px;
  color: #495057;
`;

const DonationSection = styled.div`
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  margin: 24px 0;
  border: 2px solid #e9ecef;
`;

const DonationTitle = styled.h4`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const DonationText = styled.p`
  color: #495057;
  margin-bottom: 16px;
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const QRCodeItem = styled.div`
  text-align: center;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QRCodeWrapper = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background: white;
  padding: 8px;
  border-radius: 4px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CryptoLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
`;

const AddressText = styled.p`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #6c757d;
  word-break: break-all;
  margin-top: 8px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
`;

const EasterEggSection = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 24px;
  border-radius: 8px;
  text-align: center;
  margin: 24px 0;
`;

const EasterEggTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const DonorList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const DonorItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 6px;
  backdrop-filter: blur(10px);
`;

const DonorName = styled.span`
  font-weight: 600;
`;

const DonorAmount = styled.span`
  font-size: 12px;
  opacity: 0.8;
  display: block;
  margin-top: 4px;
`;

const ReportEpilepticButton = styled.button`
  padding: 12px 20px;
  margin: 16px 0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ReportHelpText = styled.p`
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;
  text-align: center;
  line-height: 1.5;
`;

const AboutReadingDisabilityView = () => {
  return (
    <Section>
      <SectionTitle>🌊 About Wave Reader</SectionTitle>
      <SectionText>
        Wave Reader is a browser extension designed to improve reading comprehension and eye tracking 
        through gentle wave animations. By applying subtle wobble effects to text elements, 
        it helps readers maintain focus and follow text more naturally.
      </SectionText>
      <SectionText>
        <strong>How it works:</strong> The extension applies CSS animations to selected text elements, 
        creating a gentle wobble effect that mimics natural eye movement patterns. This can help reduce 
        eye strain and improve reading speed for many users.
      </SectionText>
      <SectionText>
        <strong>Features:</strong>
      </SectionText>
      <ul style={{ color: '#495057', paddingLeft: '20px' }}>
        <li>Customizable wave animations</li>
        <li>Selector mode for choosing text elements</li>
        <li>Keyboard shortcuts for quick activation</li>
        <li>Settings persistence across sessions</li>
        <li>Cross-browser compatibility</li>
      </ul>
    </Section>
  );
};

const AboutNielsonResearchView = () => {
  return (
    <Section>
      <SectionTitle>📊 Research Foundation</SectionTitle>
      <SectionText>
        The theoretical foundation draws from Nielsen Research findings on how the average reader scans 
        webpages uniformly, which we use to support the approach of assisting those with tracking 
        problems through gentle page animations.
      </SectionText>
    </Section>
  );
};

const DonateView = ({donated, hasEasterEggs, donors}: {donated: boolean, hasEasterEggs: boolean, donors: Array<{name: string, amount: string, crypto?: string}>}) => {
  return (
    <Section>
      <DonationSection>
        <DonationTitle>💝 Support Wave Reader</DonationTitle>
        <DonationText>
          If you find Wave Reader helpful, consider supporting its development with a donation. 
          Your contribution helps keep this project free and open source.
        </DonationText>
        
        <QRCodeContainer>
          <QRCodeItem>
            <QRCodeWrapper>
              <QRCodeSVG 
                value="ethereum:0x30c599E83Afc27Fc7b2bCdaF400E5c15a31C6148"
                size={134}
                level="M"
                includeMargin={false}
              />
            </QRCodeWrapper>
            <CryptoLabel>Ethereum (ETH)</CryptoLabel>
            <AddressText>0x30c599E83Afc27Fc7b2bCdaF400E5c15a31C6148</AddressText>
          </QRCodeItem>
          
          <QRCodeItem>
            <QRCodeWrapper>
              <QRCodeSVG 
                value="bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                size={134}
                level="M"
                includeMargin={false}
              />
            </QRCodeWrapper>
            <CryptoLabel>Bitcoin (BTC)</CryptoLabel>
            <AddressText>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</AddressText>
          </QRCodeItem>
        </QRCodeContainer>
        
        <DonationText style={{ fontSize: '14px', color: '#6c757d' }}>
          💡 <strong>Tip:</strong> Send a receipt or message with your donation to get your name added to our supporter list!
        </DonationText>
      </DonationSection>
      
      {donated && hasEasterEggs && (
        <EasterEggSection>
          <EasterEggTitle>🎉 Thank You, Supporters!</EasterEggTitle>
          <DonationText>
            Special thanks to our generous supporters who help keep Wave Reader free and open source:
          </DonationText>
          <DonorList>
            {donors.map((donor, index) => (
              <DonorItem key={index}>
                <DonorName>{donor.name}</DonorName>
                <DonorAmount>
                  {donor.amount} {donor.crypto ? `(${donor.crypto})` : ''}
                </DonorAmount>
              </DonorItem>
            ))}
          </DonorList>
        </EasterEggSection>
      )}
    </Section>
  );
};

// Props interface
interface AboutTomeProps {
  children?: React.ReactNode;
  donated?: boolean;
  hasEasterEggs?: boolean;
  donors?: Array<{name: string, amount: string, crypto?: string}>;
}

const AboutPageComponentView = (donated: boolean, hasEasterEggs: boolean, donors: Array<{name: string, amount: string, crypto?: string}>, error?: string | null) => {
  return (
    <AboutContent>
      {/* Header removed - EditorWrapper already provides it */}
      {error && (
          <Section>
            <div style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '16px', 
              borderRadius: '8px', 
              border: '1px solid #f5c6cb',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#721c24' }}>⚠️ Error Loading Donation Status</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
              <button 
                onClick={() => {
                  // This would trigger a retry
                  console.log('Retry donation status loading');
                }}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          </Section>
        )}
        
        <AboutReadingDisabilityView />
        <AboutNielsonResearchView />
        <DonateView donated={donated} hasEasterEggs={hasEasterEggs} donors={donors} />
        
        <Section>
          <SectionText style={{ textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
            Version 1.0.0 • Made with ❤️ for better reading
          </SectionText>
        </Section>
    </AboutContent>
  );
};

// GraphQL queries and mutations for donation status
const DONATION_STATUS_QUERY = `
  query GetDonationStatus($userId: String!) {
    donationStatus(userId: $userId) {
      donated
      hasEasterEggs
      donors {
        name
        amount
        crypto
        timestamp
      }
      totalDonations
      lastDonationDate
    }
  }
`;

const DONATION_STATUS_SUBSCRIPTION = `
  subscription DonationStatusUpdates($userId: String!) {
    donationStatusUpdated(userId: $userId) {
      donated
      hasEasterEggs
      donors {
        name
        amount
        crypto
        timestamp
      }
    }
  }
`;

const AboutPageComponent = createViewStateMachine({
  machineId: 'about-page-component',
  xstateConfig: {
    initial: 'idle',
    context: {
      donated: false,
      hasEasterEggs: false,
      donors: [
        // we may want to remove this, as hopefully the list will grow to millions or billions
        // that said, it's a nice way to show support and encourage others to donate
        // so perhaps we'll do a `top(10) sort by Date_Donated ASC` or something
        { name: "Anonymous Supporter", amount: "0.1 ETH", crypto: "ETH" },
        { name: "Beta Tester", amount: "0.05 BTC", crypto: "BTC" },
        { name: "Reading Enthusiast", amount: "0.2 ETH", crypto: "ETH" }
      ],
      isLoading: false,
      error: null,
      userId: 'anonymous', // This would come from auth context
      subscription: null
    },
    states: {
      idle: {
        on: {
          LOAD_DONATION_STATUS: 'loading',
          INITIALIZE: 'loading'
        }
      },
      loading: {
        on: {
          DONATION_STATUS_LOADED: 'idle',
          DONATION_STATUS_ERROR: 'error'
        }
      },
      error: {
        on: {
          RETRY: 'loading',
          CLEAR_ERROR: 'idle'
        }
      }
    }
  }
}).withState('idle', async ({ context, event, send, log, transition, machine, view, clear }: any) => {
  // CRITICAL: Clear any existing views first
  if (clear) {
    clear();
  }
  
  // Render the view immediately (don't wait for donation status)
  const renderedView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
  
  // Push view to ViewStateMachine's viewStack immediately
  view(renderedView);
  
  // Auto-load donation status on idle if not already loaded (non-blocking)
  if (!context.donated && !context.isLoading) {
    await log('Loading donation status...');
    send({ type: 'LOAD_DONATION_STATUS' });
  }
  
  // Return the view (ViewStateMachine pattern)
  return renderedView;
}).withState('loading', async ({ context, event, send, log, transition, machine, view, clear, graphql }: any) => {
  // CRITICAL: Render view immediately even while loading
  // This ensures content is visible while donation status loads
  const renderedView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
  
  if (clear) {
    clear();
  }
  view(renderedView);
  
  try {
    await log('Fetching donation status from GraphQL...');
    
    // Execute GraphQL query via centralized backend service
    const { data, backendDisabled } = await safeGraphQLRequest({
      endpoint: '/api/graphql/donations',
      query: DONATION_STATUS_QUERY,
      variables: { userId: context.userId },
      mockKey: 'graphql/donation-status',
      context: { userId: context.userId }
    });

    const donationData = data?.donationStatus;

    if (donationData) {
      
      // Update context with GraphQL data
      context.donated = donationData.donated || false;
      context.hasEasterEggs = donationData.hasEasterEggs || false;
      context.donors = donationData.donors || context.donors;
      context.isLoading = false;
      
      // todo: review: maybe cache this, or defer this rather than load always?
      await log('Donation status loaded successfully', { donationData, backendDisabled });
      
      // Re-render with updated donation data
      const updatedView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
      view(updatedView);
      
      // Start subscription for real-time updates
      if (!context.subscription) {
        try {
          context.subscription = await graphql.subscription(DONATION_STATUS_SUBSCRIPTION, {
            userId: context.userId
          });
          
          // Handle subscription updates
          context.subscription.subscribe({
            next: (update: any) => {
              if (update.data && update.data.donationStatusUpdated) {
                const updatedData = update.data.donationStatusUpdated;
                context.donated = updatedData.donated;
                context.hasEasterEggs = updatedData.hasEasterEggs;
                context.donors = updatedData.donors;
                log('Donation status updated via subscription', updatedData);
              }
            },
            error: (error: any) => {
              log('Subscription error', error);
            }
          });
        } catch (subError) {
          await log('Failed to start subscription', subError);
        }
      }
      
      send({ type: 'DONATION_STATUS_LOADED', payload: donationData });
    } else {
      await log("Failed to load update.data", [...context.log]);
      // Still render view even if data load failed
      const fallbackView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
      view(fallbackView);
    }
  } catch (error) {
    await log('Failed to load donation status', error);
    context.error = error instanceof Error ? error.message : 'Unknown error occurred';
    context.isLoading = false;
    // Render view with error state
    const errorView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
    view(errorView);
    send({ type: 'DONATION_STATUS_ERROR', payload: error });
  }
  
  // Return the view (ViewStateMachine pattern)
  return renderedView;
}).withState('error', ({ context, event, send, log, transition, machine, view, clear }: any) => {
  // CRITICAL: Always render view in error state
  if (clear) {
    clear();
  }
  const errorView = AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error);
  view(errorView);
  return errorView;
  if (clear) clear();
  return view(AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors, context.error));
});

// Main component using withState pattern
const AboutTome: FunctionComponent<AboutTomeProps> = ({
  children,
  donated = false,
  hasEasterEggs = false,
  donors = [
    { name: "Anonymous Supporter", amount: "0.1 ETH", crypto: "ETH" },
    { name: "Beta Tester", amount: "0.05 BTC", crypto: "BTC" },
    { name: "Reading Enthusiast", amount: "0.2 ETH", crypto: "ETH" }
  ]
}) => {
  // State management using withState pattern
  const [aboutPageComponent, setAboutPageComponent] = useState<any>(null);
  const [router, setRouter] = useState<MachineRouter | null>(null);
  const [renderKey, setRenderKey] = useState(-1);
  const [showPuppies, setShowPuppies] = useState(false);
  
  // Handler for epileptic animation report
  const handleReportEpileptic = useCallback(async () => {
    try {
      // Get the current tab URL if we're in an extension context
      let currentUrl = window.location.href;
      
      // Try to get the actual page URL from the active tab if we're in a popup
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.url) {
            currentUrl = tabs[0].url;
          }
        } catch (e) {
          // If we can't get the tab URL, use the current location
          console.warn('Could not get tab URL:', e);
        }
      }
      
      const subject = encodeURIComponent('Epileptic Animation Report - Wave Reader');
      const body = encodeURIComponent(
        `I am reporting an animation that may trigger epileptic symptoms.\n\n` +
        `URL: ${currentUrl}\n` +
        `Timestamp: ${new Date().toISOString()}\n\n` +
        `Additional details:\n`
      );
      const mailtoLink = `mailto:john.gebhard.holland+epileptic@gmail.com?subject=${subject}&body=${body}`;
      
      // Use window.location for mailto links - this is the proper way in extensions
      // Don't use target="_blank" as it causes issues with mailto links
      window.location.href = mailtoLink;
    } catch (error) {
      console.error('Error opening mailto link:', error);
      // Fallback: try creating an anchor element
      const subject = encodeURIComponent('Epileptic Animation Report - Wave Reader');
      const body = encodeURIComponent(
        `I am reporting an animation that may trigger epileptic symptoms.\n\n` +
        `URL: ${window.location.href}\n` +
        `Timestamp: ${new Date().toISOString()}\n\n` +
        `Additional details:\n`
      );
      const mailtoLink = `mailto:john.gebhard.holland+epileptic@gmail.com?subject=${subject}&body=${body}`;
      
      const anchor = document.createElement('a');
      anchor.href = mailtoLink;
      // Don't set target for mailto links
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }, []);
 
  useEffect(() => {
    // Get router from AppTome
    const appTomeRouter = AppTome.getRouter();
    setRouter(appTomeRouter);

    // Check feature toggle for puppies
    const checkPuppiesToggle = async () => {
      try {
        // Try to get RobotCopy instance from background proxy machine
        const bgProxyMachine = appTomeRouter?.resolve('BackgroundProxyMachine');
        const robotCopy = bgProxyMachine?.robotCopy || null;
        
        const toggleService = new FeatureToggleService(robotCopy);
        const enabled = await toggleService.isEnabled('ENABLE_PUPPIES');
        setShowPuppies(enabled);
      } catch (error) {
        console.warn('Failed to check puppies feature toggle, defaulting to disabled', error);
        setShowPuppies(false);
      }
    };

    checkPuppiesToggle();

    // Create machine instance
    const component = AboutPageComponent;
    
    // Set router on machine if available
    if (appTomeRouter && component.setRouter) {
      component.setRouter(appTomeRouter);
      // Register machine with router
      appTomeRouter.register('AboutMachine', component);
    }
    
    setAboutPageComponent(component);
    
    // Observe view key changes to trigger re-renders (if method exists)
    let unsubscribe: (() => void) | null = null;
    const componentAny = component as any;
    if (componentAny && typeof componentAny.observeViewKey === 'function') {
      unsubscribe = componentAny.observeViewKey((key: number) => {
        setRenderKey(key);
      });
    } else {
      // Fallback: manually update renderKey when state changes
      const stateSubscription = component.subscribe?.((state: any) => {
        setRenderKey(prev => prev + 1);
      });
      if (stateSubscription && typeof stateSubscription === 'function') {
        unsubscribe = stateSubscription;
      } else if (stateSubscription && typeof stateSubscription === 'object' && 'unsubscribe' in stateSubscription) {
        unsubscribe = () => (stateSubscription as any).unsubscribe();
      }
    }
    
    // Test: Check state handlers before start
    const stateHandlers = (componentAny as any).stateHandlers;
    const stateHandlersIsMap = stateHandlers instanceof Map;
    console.log('TEST: Before start()', {
      hasStateHandlers: !!stateHandlers,
      isMap: stateHandlersIsMap,
      handlers: stateHandlersIsMap 
        ? Array.from(stateHandlers.keys())
        : (stateHandlers ? Object.keys(stateHandlers) : []),
      hasIdle: stateHandlersIsMap 
        ? stateHandlers.has('idle')
        : (stateHandlers && 'idle' in stateHandlers)
    });
    
    // Test: Call start() and check what happens
    console.log('TEST: Calling start()...');
    component.start();
    
    // Test: Check state and viewStack after start
    const stateAfterStart = component.getState?.();
    const viewStackAfterStart = (componentAny as any).viewStack;
    console.log('TEST: After start()', {
      stateValue: stateAfterStart?.value,
      viewStackLength: Array.isArray(viewStackAfterStart) ? viewStackAfterStart.length : 'not array',
      viewStackType: typeof viewStackAfterStart,
      renderResult: component.render?.()
    }); 

    // Cleanup: unregister on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (appTomeRouter && component) {
        appTomeRouter.unregister('AboutMachine');
      }
    };
  }, []);

  if (!aboutPageComponent) {
    return (
        <EditorWrapper
          title="About Wave Reader"
          description="Information about Wave Reader and its features"
          componentId="about-component"
          router={router || undefined}
          key={renderKey}
          onError={(error) => console.error('About Editor Error:', error)}
          hideHeader={true}
        >
          <div>Loading...</div>
        </EditorWrapper>
      );
    }

    return (
      <EditorWrapper
        title="About Wave Reader"
        description="Information about Wave Reader and its features"
        componentId="about-component"
        router={router || undefined}
        key={renderKey}
        onError={(error) => console.error('About Editor Error:', error)}
        hideHeader={true}
      >
        {(() => {
          const rendered = aboutPageComponent.render();
          
          if (!rendered) {
            const viewStack = (aboutPageComponent as any).getViewStack?.();
            if (viewStack && viewStack.length > 0) {
              return (aboutPageComponent as any).viewStack?.compose?.() || <div>ViewStack has content but compose failed</div>;
            }
            return <div>Loading About content...</div>;
          }
          console.log('WOOHOO about tome rendered', rendered);
          // return null in the mean time
          return null;
        })()}

       {(showPuppies || !showPuppies) && AboutPageComponentView(false, false, [], null)}
        
        {showPuppies && (
          <div style={{ marginTop: '24px' }}>
            <PuppyTome skipWrapper={true} />
          </div>
        )}
        <div style={{ marginTop: '24px' }}>
          <Section>
            <ReportEpilepticButton
              onClick={handleReportEpileptic}
              title="Report epileptic triggering animation"
            >
              🚨 Report Epileptic Animation
            </ReportEpilepticButton>
            <ReportHelpText>
              If any animation triggers epileptic symptoms or seizures, please report it immediately. 
              We prioritize accessibility and will investigate all reports.
            </ReportHelpText>
          </Section>
        </div>
      </EditorWrapper>
    );
};

export default AboutTome;
export { AboutPageComponent }; // Export for testing
