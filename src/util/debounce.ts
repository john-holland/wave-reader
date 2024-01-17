const debounce = ( fn: { (): void }, timeout: number = 500, activateImmediately = false ) => {
    let lastActivate = activateImmediately ? new Date().getTime() : -1;
    // the typeof checks are because it's used from javascript and although we probably would get a type error during runtime, idk /shrug/
    if (activateImmediately && typeof fn === "function") {
        fn(); // fn asap!
    }
    return () => {
        if (new Date().getTime() - lastActivate > timeout) {
            lastActivate = new Date().getTime();
            if (typeof fn === "function") fn();
        } else {
            if (typeof console.trace === "function") console.trace("debounce!");
            else console.log("debounce!");
        }
    }
}

export default debounce;