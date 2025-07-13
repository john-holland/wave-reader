import React, { FunctionComponent } from 'react';
import { Typography, Box, Paper, Divider } from '@mui/material';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 16px;
  max-width: 100%;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const DonationSection = styled(Paper)`
  padding: 16px;
  margin-top: 16px;
  text-align: center;
  background-color: #f8f9fa;
`;

const DonationImage = styled.div`
  width: 60%;
  margin: 16px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface AboutProps {
  // Add any props if needed in the future
}

const About: FunctionComponent<AboutProps> = () => {
  return (
    <AboutContainer>
      <Section>
        <Typography variant="h5" component="h2" gutterBottom>
          🌊 Wave Reader
        </Typography>
        <Typography variant="body1" paragraph>
          Wave Reader is a browser extension designed to improve reading comprehension and eye tracking 
          through gentle wave animations. By applying subtle wobble effects to text elements, 
          it helps readers maintain focus and follow text more naturally.
        </Typography>
      </Section>

      <Divider sx={{ my: 2 }} />

      <Section>
        <Typography variant="h6" component="h3" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body2" paragraph>
          The extension applies CSS animations to selected text elements, creating a gentle 
          wobble effect that mimics natural eye movement patterns. This can help reduce 
          eye strain and improve reading speed for many users.
        </Typography>
        <Typography variant="body2" paragraph>
          You can customize the animation parameters in the Settings tab, including 
          wave speed, rotation amounts, and translation distances to find what works 
          best for your reading style.
        </Typography>
      </Section>

      <Divider sx={{ my: 2 }} />

      <Section>
        <Typography variant="h6" component="h3" gutterBottom>
          Features
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>Customizable wave animations</li>
          <li>Selector mode for choosing text elements</li>
          <li>Keyboard shortcuts for quick activation</li>
          <li>Settings persistence across sessions</li>
          <li>Cross-browser compatibility</li>
        </Typography>
      </Section>

      <Divider sx={{ my: 2 }} />

      <DonationSection elevation={1}>
        <Typography variant="h6" component="h3" gutterBottom>
          Support Wave Reader
        </Typography>
        <Typography variant="body2" paragraph>
          If you find Wave Reader helpful, consider supporting its development with an 
          Ethereum donation. Your contribution helps keep this project free and open source.
        </Typography>
        
        <DonationImage>
          <img 
            src="receive_eth.jpg" 
            alt="Ethereum QR Code" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxWidth: '300px',
              display: 'block'
            }} 
          />
        </DonationImage>
        
        <Typography variant="caption" color="textSecondary">
          Address: 0x30c599E83Afc27Fc7b2bCdaF400E5c15a31C6148
        </Typography>
      </DonationSection>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Version 1.0.0 • Made with ❤️ for better reading
        </Typography>
      </Box>
    </AboutContainer>
  );
};

export default About; 