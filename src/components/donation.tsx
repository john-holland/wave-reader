import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, Box, Divider, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import StarIcon from '@mui/icons-material/Star';

const DonationContainer = styled.div`
  padding: 20px;
`;

const PaymentButton = styled(Button)`
  margin: 10px;
  min-width: 200px;
`;

const DonationAmount = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const PuppyImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const ToggleContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

// Fallback puppy images in case Unsplash API fails
const FALLBACK_PUPPY_IMAGES = [
  // Golden Retriever puppy with a big smile
  'https://images.unsplash.com/photo-1591160690555-5debfba289f0',
  // Corgi puppy with floppy ears
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
  // French Bulldog puppy with a curious look
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
  // Husky puppy with blue eyes
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
  // Dachshund puppy in a blanket
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
  // Border Collie puppy playing
  'https://images.unsplash.com/photo-1591160690555-5debfba289f0',
  // Pug puppy with a tilted head
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
  // Beagle puppy with big ears
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b'
];

// Fallback kitten images
const FALLBACK_KITTEN_IMAGES = [
  // Orange tabby kitten playing
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
  // Siamese kitten with blue eyes
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
  // Black kitten with white paws
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec',
  // Grey kitten sleeping
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
  // White kitten with blue eyes
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
  // Calico kitten playing with yarn
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce',
  // Maine Coon kitten
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
  // Persian kitten
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'
];

// Special cats collection
const SPECIAL_CATS = [
  // Nala's spot (placeholder for when you share the actual photo)
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', // Placeholder for Nala
  // Other special cats
  'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987',
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55'
];

const Donation: FunctionComponent = () => {
  const [puppyImage, setPuppyImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [mode, setMode] = useState<'puppy' | 'kitten' | 'special'>('puppy');
  const MAX_RETRIES = 3;

  const fetchAnimalImage = async () => {
    try {
      setLoading(true);
      if (mode === 'special') {
        // For special cats, use our curated collection
        const specialImage = SPECIAL_CATS[retryCount % SPECIAL_CATS.length];
        setPuppyImage(specialImage);
        return;
      }

      const animalType = mode === 'puppy' ? 'puppy' : 'kitten';
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${animalType}&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
      const data = await response.json();
      
      const isAppropriate = await verifyImageWithGoogleVision(data.urls.regular);
      
      if (isAppropriate) {
        setPuppyImage(data.urls.regular);
      } else {
        throw new Error('Image not appropriate');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const fallbackImages = mode === 'puppy' ? FALLBACK_PUPPY_IMAGES : FALLBACK_KITTEN_IMAGES;
        setPuppyImage(fallbackImages[retryCount % fallbackImages.length]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for Google Vision API integration
  const verifyImageWithGoogleVision = async (imageUrl: string): Promise<boolean> => {
    // TODO: Implement actual Google Vision API check
    return true;
  };

  useEffect(() => {
    fetchAnimalImage();
  }, [mode]);

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'puppy' | 'kitten' | 'special' | null) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const getModeEmoji = () => {
    switch (mode) {
      case 'puppy': return '🐕';
      case 'kitten': return '🐱';
      case 'special': return '⭐';
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'puppy': return 'Puppy';
      case 'kitten': return 'Kitten';
      case 'special': return 'Special Cats';
    }
  };

  const handleSquarePay = () => {
    // TODO: Implement Square Pay integration
    console.log('Square Pay clicked');
  };

  const handleGPay = () => {
    // TODO: Implement Google Pay integration
    console.log('Google Pay clicked');
  };

  const handleShopPay = () => {
    // TODO: Implement Shop Pay integration
    console.log('Shop Pay clicked');
  };

  const handleAutobanDonation = () => {
    // TODO: Implement Autoban Society donation
    console.log('Autoban Society donation clicked');
  };

  return (
    <DonationContainer>
      <Typography variant="h5" gutterBottom>
        Support Wave Reader
      </Typography>
      <Typography variant="body1" paragraph>
        If you find Wave Reader helpful, consider making a donation to support its development.
      </Typography>

      <ToggleContainer>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="animal mode"
        >
          <ToggleButton value="puppy" aria-label="puppy mode">
            <PetsIcon sx={{ mr: 1 }} /> Puppy Mode
          </ToggleButton>
          <ToggleButton value="kitten" aria-label="kitten mode">
            <PetsOutlinedIcon sx={{ mr: 1 }} /> Kitten Mode
          </ToggleButton>
          <ToggleButton value="special" aria-label="special cats mode">
            <StarIcon sx={{ mr: 1 }} /> Special Cats
          </ToggleButton>
        </ToggleButtonGroup>
      </ToggleContainer>

      <ImageContainer>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <PuppyImage 
              src={puppyImage} 
              alt={mode === 'puppy' ? "Cute puppy" : mode === 'kitten' ? "Adorable kitten" : "Special cat"} 
            />
            {mode === 'kitten' && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                Dedicated to Nala, the best cat ever! 🐱💕
              </Typography>
            )}
            {mode === 'special' && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                Featuring Nala and other special cats! ⭐🐱
              </Typography>
            )}
            <Button 
              variant="outlined" 
              onClick={fetchAnimalImage}
              sx={{ mt: 2 }}
            >
              Show Another {getModeTitle()} {getModeEmoji()}
            </Button>
          </>
        )}
      </ImageContainer>

      <DonationAmount>
        <PaymentButton variant="contained" color="primary" onClick={handleSquarePay}>
          Donate with Square Pay
        </PaymentButton>
        <PaymentButton variant="contained" color="primary" onClick={handleGPay}>
          Donate with Google Pay
        </PaymentButton>
        <PaymentButton variant="contained" color="primary" onClick={handleShopPay}>
          Donate with Shop Pay
        </PaymentButton>
      </DonationAmount>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Support the Autoban Society
      </Typography>
      <Typography variant="body1" paragraph>
        The Autoban Society works to protect users from automated threats and improve web security.
      </Typography>
      <PaymentButton variant="contained" color="secondary" onClick={handleAutobanDonation}>
        Donate to Autoban Society
      </PaymentButton>
    </DonationContainer>
  );
};

export default Donation; 