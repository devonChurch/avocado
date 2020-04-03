import React, { useEffect, useRef } from "react";

export const useLoadControl = callback => {
  const loadControl = useRef();

  useEffect(() => {
    // Throttler - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
    const throttleRaf = window.requestAnimationFrame;
    let isThrottleRunning = false;

    // Debouncer - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
    const DEBOUNCE_MILLISECONDS = 100;
    let debounceId;
    const createDebounce = (...args) =>
      (debounceId = window.setTimeout(() => callback(...args), DEBOUNCE_MILLISECONDS));
    const removeDebounce = () => window.clearTimeout(debounceId);

    // Depending on the current "load controlled" situation we want to begin a
    // throttle sequence or defer the callback to a debounced scenario.
    loadControl.current = (...args) => {
      if (isThrottleRunning) {
        // If we are already throttling - the callback is STILL IMPORTANT. If the
        // throttle finishes but misses the final user input then we could potential
        // have the <input /> and <Swatch /> UI out of sync. In this case we create
        // a debounced, which will wait a period of time then run the supplied callback.
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // We do not want to stack callbacks and have them ALL run once their timeout
        // expires. We ONLY care about the last supplied callback. In that regard,
        // we destroy the preceding debounced setup and create a new one. This keep
        // pushing out the time to run the callback while the thriller is still
        // running.
        removeDebounce();
        createDebounce(...args);
      } else {
        // If there is NO throttler instance then this is a "fresh" call to "load
        // control". Here we run the callback inside of a requestAnimationCall so
        // that its run when the browser has the capability to do so.
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        // We ONLY want to run ONE callback per CPU cycle. In that regard we STOP
        // callbacks from stacking by toggling the isThrottleRunning boolean BEFORE
        // and AFTER the callback runs.
        isThrottleRunning = true;
        throttleRaf(() => {
          callback(...args);
          isThrottleRunning = false;
        });
      }
    };

    // Make sure to destroy anything that can run a callback AFTER a <Component />
    // has unmounted.
    return () => {
      removeDebounce();
      cancelAnimationFrame(throttleRaf);
    };
  }, []);

  // If the useEffect system has not been setup yet (happens in the first tick(s))
  // then we just fall back to the vanilla callback until the "load control"
  // enrichment is complete.
  return loadControl.current || callback;
};
