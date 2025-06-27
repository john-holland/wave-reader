type Config = {
    mode: string;
}

// Import the development config directly
import developConfig from './config.develop.js';

const configured: Config = developConfig;

if (configured.mode === "unset") {
    console.log("unset configuration mode! " + JSON.stringify(configured));
}

export default configured;
