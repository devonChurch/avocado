import React, { useEffect } from "react";
import { LoadControl } from "eggs-benedict";

export const Scroll = () => {
  useEffect(() => {
    let offset;
    let throttleId;
    const createThrottle = (action) => (throttleId = window.requestAnimationFrame(action));
    const removeThrottle = () => (throttleId = window.cancelAnimationFrame(throttleId));
    const checkIsThrottling = () => Boolean(throttleId);

    const setScroll = () => {
      const { innerHeight, scrollY } = window;
      const nextScroll = scrollY + offset;
      const isTooHigh = nextScroll < 0;
      const isTooLow = nextScroll > document.body.clientHeight - innerHeight;
      const shouldScroll = !isTooHigh && !isTooLow;

      if (shouldScroll) {
        window.scroll(0, nextScroll);
        createThrottle(setScroll);
      } else {
        removeThrottle();
      }
    };

    const checkScenario = (event) => {
      const viewPortHeight = window.innerHeight;
      const viewPortQuarter = viewPortHeight / 4;
      const pointerPosition = event.clientY;
      const isOverTopQuarter = pointerPosition < viewPortQuarter;
      const isOverBottomQuarter = pointerPosition > viewPortQuarter * 3;
      const maxScrollOffset = viewPortQuarter;
      const isThrottling = checkIsThrottling();
      const shouldUpdateScroll = !isThrottling && (isOverTopQuarter || isOverBottomQuarter);
      const shouldStopScroll = isThrottling && !(isOverTopQuarter || isOverBottomQuarter);

      if (isOverTopQuarter) {
        const percentageOffset = (viewPortQuarter - pointerPosition) / viewPortQuarter;
        const pixelOffset = maxScrollOffset * percentageOffset;
        offset = -pixelOffset;
      }

      if (isOverBottomQuarter) {
        const percentageOffset = (pointerPosition - viewPortQuarter * 3) / viewPortQuarter;
        const pixelOffset = maxScrollOffset * percentageOffset;
        offset = pixelOffset;
      }

      if (shouldUpdateScroll) {
        createThrottle(setScroll);
      }

      if (shouldStopScroll) {
        removeThrottle();
      }
    };

    const [dragLoadControl, cleanUpDragLoadControl] = LoadControl(checkScenario, {});
    window.addEventListener("dragover", dragLoadControl);

    return function cleanUp() {
      removeThrottle();
      cleanUpDragLoadControl();
      window.removeEventListener("dragover", dragLoadControl);
    };
  }, []);

  return null;
};
