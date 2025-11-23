import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createViewStateMachine, MachineRouter } from 'log-view-machine';
import EditorWrapper from '../../app/components/EditorWrapper';
import { AppTome } from '../../app/tomes/AppTome';

// Styled components for the Puppies page
const PuppiesView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  line-height: 1.6;
  color: #333;
`;

const PuppiesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PuppiesTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const PuppiesContent = styled.div`
  padding: 24px;
  min-height: 200px;
  color: #333;
`;

const PuppiesSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h4`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const HeroImageContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  max-height: 400px;
  object-fit: cover;
`;

const PuppiesCarousel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const PuppyImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: #6c757d;
`;

const ErrorContainer = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
`;

const AttributionText = styled.p`
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  margin-top: 16px;
  font-style: italic;
`;

interface PuppyImageData {
  id: string;
  url: string;
  alt: string;
  photographer?: string;
  photographerUrl?: string;
}

interface PuppyTomeProps {
  children?: React.ReactNode;
  skipWrapper?: boolean;
}

const PuppyView = (
  heroImage: PuppyImageData | null,
  carouselImages: PuppyImageData[],
  isLoading: boolean,
  error: string | null
) => {
  if (isLoading) {
    return (
      <PuppiesView>
        <PuppiesHeader>
          <PuppiesTitle>🐾 Puppies & Kittens</PuppiesTitle>
        </PuppiesHeader>
        <PuppiesContent>
          <LoadingContainer>
            <p>Loading adorable puppies and kittens...</p>
          </LoadingContainer>
        </PuppiesContent>
      </PuppiesView>
    );
  }

  if (error) {
    return (
      <PuppiesView>
        <PuppiesHeader>
          <PuppiesTitle>🐾 Puppies & Kittens</PuppiesTitle>
        </PuppiesHeader>
        <PuppiesContent>
          <ErrorContainer>
            <h4 style={{ margin: '0 0 8px 0', color: '#721c24' }}>⚠️ Error Loading Images</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
          </ErrorContainer>
        </PuppiesContent>
      </PuppiesView>
    );
  }

  return (
    <PuppiesView>
      <PuppiesHeader>
        <PuppiesTitle>🐾 Puppies & Kittens</PuppiesTitle>
      </PuppiesHeader>
      <PuppiesContent>
        <PuppiesSection>
          {heroImage && (
            <HeroImageContainer>
              <HeroImage 
                src={heroImage.url} 
                alt={heroImage.alt}
                onError={(e) => {
                  console.error('Failed to load hero image:', heroImage.url);
                }}
              />
            </HeroImageContainer>
          )}

          {carouselImages.length > 0 && (
            <>
              <SectionTitle>More Cuteness</SectionTitle>
              <PuppiesCarousel>
                {carouselImages.map((image, index) => (
                  <PuppyImage
                    key={image.id || index}
                    src={image.url}
                    alt={image.alt}
                    onError={(e) => {
                      console.error('Failed to load image:', image.url);
                    }}
                  />
                ))}
              </PuppiesCarousel>
            </>
          )}

          <AttributionText>
            Photos from{' '}
            <a 
              href="https://unsplash.com/?utm_source=wave-reader&utm_medium=referral" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#667eea' }}
            >
              Unsplash
            </a>
          </AttributionText>
        </PuppiesSection>
      </PuppiesContent>
    </PuppiesView>
  );
};

// Generate Unsplash URLs for puppy/kitten images
const generateUnsplashUrls = (count: number): PuppyImageData[] => {
  const imageData: PuppyImageData[] = [];
  const width = 800;
  const height = 600;
  const queries = ['puppy', 'kitten', 'puppies', 'kittens', 'dog', 'cat'];

  for (let i = 0; i < count; i++) {
    const query = queries[i % queries.length];
    const url = `https://source.unsplash.com/${width}x${height}/?${query}&sig=${Date.now()}-${i}`;
    imageData.push({
      id: `unsplash-${i}-${Date.now()}`,
      url,
      alt: `Cute ${query}`,
    });
  }

  return imageData;
};

const PuppyPageComponent = createViewStateMachine({
  machineId: 'puppy-page-component',
  xstateConfig: {
    initial: 'idle',
    context: {
      heroImage: null as PuppyImageData | null,
      carouselImages: [] as PuppyImageData[],
      isLoading: false,
      error: null as string | null,
    },
    states: {
      idle: {
        on: {
          LOAD_IMAGES: 'loading',
          REFRESH_IMAGES: 'loading'
        }
      },
      loading: {
        on: {
          IMAGES_LOADED: 'loaded',
          IMAGES_ERROR: 'error'
        }
      },
      loaded: {
        on: {
          REFRESH_IMAGES: 'loading'
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
}).withState('idle', async ({ context, event, send, log, transition, machine, view }: any) => {
  // Auto-load images on idle if not already loaded
  if (!context.heroImage && !context.isLoading) {
    await log('Loading puppy images...');
    send({ type: 'LOAD_IMAGES' });
  }
  
  return view(PuppyView(context.heroImage, context.carouselImages, context.isLoading, context.error));
}).withState('loading', async ({ context, event, send, log, transition, machine, view }: any) => {
  try {
    await log('Fetching images from Unsplash...');
    
    // Generate image URLs (1 hero + 6 carousel = 7 total)
    const allImages = generateUnsplashUrls(7);
    const hero = allImages[0];
    const carousel = allImages.slice(1);

    // Update context with images
    context.heroImage = hero;
    context.carouselImages = carousel;
    context.isLoading = false;
    context.error = null;
    
    await log('Images loaded successfully', { heroCount: 1, carouselCount: carousel.length });
    
    send({ type: 'IMAGES_LOADED', payload: { hero, carousel } });
  } catch (error) {
    await log('Failed to load images', error);
    context.error = error instanceof Error ? error.message : 'Unknown error occurred';
    context.isLoading = false;
    send({ type: 'IMAGES_ERROR', payload: error });
  }
  
  return view(PuppyView(context.heroImage, context.carouselImages, context.isLoading, context.error));
}).withState('loaded', ({ context, event, send, log, transition, machine, view }: any) => {
  return view(PuppyView(context.heroImage, context.carouselImages, context.isLoading, context.error));
}).withState('error', ({ context, event, send, log, transition, machine, view }: any) => {
  return view(PuppyView(context.heroImage, context.carouselImages, context.isLoading, context.error));
});

const PuppyTome: FunctionComponent<PuppyTomeProps> = ({ children, skipWrapper = false }) => {
  const [puppyPageComponent, setPuppyPageComponent] = useState<any>(null);
  const [router, setRouter] = useState<MachineRouter | null>(null);
  const [renderKey, setRenderKey] = useState(-1);

  useEffect(() => {
    // Get router from AppTome
    const appTomeRouter = AppTome.getRouter();
    setRouter(appTomeRouter);

    // Create machine instance
    const component = PuppyPageComponent;
    
    // Set router on machine if available
    if (appTomeRouter && component.setRouter) {
      component.setRouter(appTomeRouter);
      // Register machine with router
      appTomeRouter.register('PuppyMachine', component);
    }
    
    setPuppyPageComponent(component);
    component.start();
    component.send({ type: 'INITIALIZE' });

    // Observe view key changes to trigger re-renders (if method exists)
    let unsubscribe: (() => void) | null = null;
    const componentAny = component as any;
    if (componentAny && typeof componentAny.observeViewKey === 'function') {
      unsubscribe = componentAny.observeViewKey(setRenderKey);
    }

    // Cleanup: unregister on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (appTomeRouter && component) {
        appTomeRouter.unregister('PuppyMachine');
      }
    };
  }, []);

  const renderedContent = !puppyPageComponent ? <div>Loading...</div> : puppyPageComponent.render();

  if (skipWrapper) {
    return <>{renderedContent}</>;
  }

  if (!puppyPageComponent) {
    return (
      <EditorWrapper
        title="Puppies & Kittens"
        description="Adorable puppies and kittens to brighten your day"
        componentId="puppy-component"
        router={router || undefined}
        key={renderKey}
        onError={(error) => console.error('Puppy Editor Error:', error)}
      >
        <div>Loading...</div>
      </EditorWrapper>
    );
  }

  return (
    <EditorWrapper
      title="Puppies & Kittens"
      description="Adorable puppies and kittens to brighten your day"
      componentId="puppy-component"
      router={router || undefined}
      key={renderKey}
      onError={(error) => console.error('Puppy Editor Error:', error)}
    >
      {puppyPageComponent.render()}
    </EditorWrapper>
  );
};

export default PuppyTome;

