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
};


// Export the template
export { AboutPageComponentViewStateMachineTemplate };
