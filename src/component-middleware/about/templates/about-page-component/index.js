import { AboutPageMachine } from '../robotcopy-pact-config';
import { createViewStateMachine } from 'log-view-machine';

/**
 * Wave Tabs Component Template
 * 
 * A template for a tabbed interface component using withState for state management
 * with separate views for each tab state and routing support.
 */
const AboutPageComponentTemplate = {
  id: 'about-page-component',
  name: 'About Page Component',
  description: 'A tab for the about page with prep for donations and easter eggs',
  version: '1.0.0',
  dependencies: ['log-view-machine'],
  
  // Template configuration
  config: {
    machineId: 'about-page-component',
    subMachines: [
      AboutPageMachine
    ],
    xstateConfig: {
      id: 'about-page-component',
      initial: 'idle',
      context: {
        donated: false,
        hasEasterEggs: false
      },
      states: {
        idle: {
          on: {
            INITIALIZE: {
              actions: ['initialize']
            }
          }
        },
        initialize: {
          on: {
            DONATION_STATUS_UPDATED: {
              actions: ['donationStatusUpdated']
            },
            INITIALIZATION_COMPLETE: 'ready'
          }
        }
      },
      actions: {
        initialize: async (context, event, send, log, transition, machine) => {
          await context.log('Initializing about page component');
          // todo: send to backend
          machine.parentMachine.getSubMachine('donation-page-machine').send('CHECK_STATUS');
          context.model.donated = true;
          context.model.hasEasterEggs = true;
        },
        donationStatusUpdated: async (context, event, send, log, transition, machine) => {
          await context.log('Donation status updated');
          context.model.donated = event.donated;
          context.model.hasEasterEggs = event.hasEasterEggs;
        }
      }
    }
  }
}
.withState('idle', ({ context, event, send, log, transition, machine, view }) => {
  return view({
    <div>
      <p>About</p>
    </div>
  });
});


// Styled components for the Tomes-based about page
const AboutView = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
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

const AboutReadingDisabilityView = () => {
  return (
    `<div>
      <p>About Reading Disability</p>
    </div>`
  );
};

const AboutNielsonResearchView = () => {
  return (
    `<div>
      <p>About Nielsen Research</p>
    </div>`
  );
};

const DonateView = ({donated, hasEasterEggs}: {donated: boolean, hasEasterEggs: boolean}) => {
  return (
    `<div>
      <p>Please Donate!</p>

      ${/* implement puppy unsplash and cat unsplash viewer here */}
      ${donated && hasEasterEggs && (<EasterEggs />)}
    </div>`
  );
};


// Props interface
interface AboutPageProps {
  children?: React.ReactNode;
  donated: boolean = false;
  hasEasterEggs?: boolean = false;
}
const EasterEggs = () => {
  return (
    `<div>
      <p>Easter Eggs</p>
    </div>`
  );
};

// Main component using withState pattern
const AboutPage: FunctionComponent = ({
  children,
  donated,
  hasEasterEggs = false
}) => {
  // State management using withState pattern

  useEffect(() => {

  });

  return (
    <AboutView>
      <AboutHeader>
        <AboutTitle>About</AboutTitle>
      </AboutHeader>  
      
      <AboutContent>
        <p><AboutReadingDisabilityView /></p>
        <p><AboutNielsonResearchView /></p>
        <p><DonateView donated={donated} hasEasterEggs={hasEasterEggs} /></p>
      </AboutContent>
    </AboutView>
  );
};

// Export the template
export { WaveTabsComponentTemplate };
