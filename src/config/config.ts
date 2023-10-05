/* globals config */

type Config = {
    mode: string;
}

const unset: Config = { mode: "unset" };

// @ts-ignore
const configured: Config = typeof config === "object" ? global.config?.default || unset : unset;
if (configured.mode === "unset") {
    console.log("unset configuration mode! " + JSON.stringify(configured));
}

export default configured;
