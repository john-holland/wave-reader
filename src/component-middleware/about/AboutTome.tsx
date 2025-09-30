import React, { FunctionComponent, useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { AboutPageComponentViewStateMachineTemplate } from './templates/about-page-component/index.js';
import { createViewStateMachine } from 'log-view-machine';

// Styled components for the Tomes-based about page
const AboutView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  line-height: 1.6;
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
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
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

const QRCodeImage = styled.img`
  width: 150px;
  height: 150px;
  display: block;
  margin-bottom: 8px;
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
    </Section>
  );
};

const AboutNielsonResearchView = () => {
  return (
    <Section>
      <SectionTitle>📊 Research Foundation</SectionTitle>
      <SectionText>
        Wave Reader is based on research into how people read and scan web content. Studies have shown 
        that eye movement patterns can be improved through subtle visual cues and animations.
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
            <QRCodeImage 
              src="receive_eth.jpg" 
              alt="Ethereum QR Code" 
            />
            <CryptoLabel>Ethereum (ETH)</CryptoLabel>
            <AddressText>0x30c599E83Afc27Fc7b2bCdaF400E5c15a31C6148</AddressText>
          </QRCodeItem>
          
          <QRCodeItem>
            <QRCodeImage 
              src="receive_btc.jpg" 
              alt="Bitcoin QR Code" 
            />
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

const AboutPageComponentView = (donated: boolean, hasEasterEggs: boolean, donors: Array<{name: string, amount: string, crypto?: string}>) => {
  return (
    <AboutView>
      <AboutHeader>
        <AboutTitle>🌊 About Wave Reader</AboutTitle>
      </AboutHeader>  
      
      <AboutContent>
        <AboutReadingDisabilityView />
        <AboutNielsonResearchView />
        <DonateView donated={donated} hasEasterEggs={hasEasterEggs} donors={donors} />
        
        <Section>
          <SectionText style={{ textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
            Version 1.0.0 • Made with ❤️ for better reading
          </SectionText>
        </Section>
      </AboutContent>
    </AboutView>
  );
};

const AboutPageComponent = createViewStateMachine({
  ...AboutPageComponentViewStateMachineTemplate,
  context: {
    donated: false,
    hasEasterEggs: false,
    donors: [
      { name: "Anonymous Supporter", amount: "0.1 ETH", crypto: "ETH" },
      { name: "Beta Tester", amount: "0.05 BTC", crypto: "BTC" },
      { name: "Reading Enthusiast", amount: "0.2 ETH", crypto: "ETH" }
    ]
  }
}).withState('idle', ({ context, event, send, log, transition, machine, view }: any) => {
  return view(AboutPageComponentView(context.donated, context.hasEasterEggs, context.donors));
}).withState('initialize', ({ context, event, send, log, transition, machine, view }: any) => {
  return view(AboutPageComponentView(false, false, context.donors));
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
 
  useEffect(() => {
    const component = AboutPageComponent;
    setAboutPageComponent(component);
    component.start();
    component.send({ type: 'INITIALIZE' });
  }, []);

  if (!aboutPageComponent) {
    return <div>Loading...</div>;
  }

  return (
    aboutPageComponent.render()
  );
};

export default AboutTome;
