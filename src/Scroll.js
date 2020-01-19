import React, { useEffect, useRef } from "react";
import throttle from "lodash.throttle";

export const Scroll = () => {
  const offset = useRef();
  const throttledScroll = useRef();

  useEffect(() => {
    const setScroll = () => {
      const { innerHeight, scrollY } = window;
      const nextScroll = scrollY + offset.current;
      const isTooHigh = nextScroll < 0;
      const isTooLow = nextScroll > document.body.clientHeight - innerHeight;
      const shouldScroll = !isTooHigh && !isTooLow;

      if (shouldScroll) {
        window.scroll(0, nextScroll);
        throttledScroll.current = requestAnimationFrame(setScroll);
      } else {
        throttledScroll.current = null;
      }
    };

    const checkScenario = event => {
      const viewPortHeight = window.innerHeight;
      const viewPortQuarter = viewPortHeight / 4;
      const pointerPosition = event.clientY;
      const isOverTopQuarter = pointerPosition < viewPortQuarter;
      const isOverBottomQuarter = pointerPosition > viewPortQuarter * 3;
      const maxScrollOffset = viewPortQuarter;
      const shouldUpdateScroll =
        !throttledScroll.current && (isOverTopQuarter || isOverBottomQuarter);
      const shouldStopScroll =
        throttledScroll.current && !(isOverTopQuarter || isOverBottomQuarter);

      if (isOverTopQuarter) {
        const percentageOffset = (viewPortQuarter - pointerPosition) / viewPortQuarter;
        const pixelOffset = maxScrollOffset * percentageOffset;
        offset.current = -pixelOffset;
      }

      if (isOverBottomQuarter) {
        const percentageOffset = (pointerPosition - viewPortQuarter * 3) / viewPortQuarter;
        const pixelOffset = maxScrollOffset * percentageOffset;
        offset.current = pixelOffset;
      }

      if (shouldUpdateScroll) {
        throttledScroll.current = requestAnimationFrame(setScroll);
      }

      if (shouldStopScroll) {
        throttledScroll.current = null;
      }
    };

    const handlePointerMove = event => {
      checkScenario(event);
    };

    const throttledDrag = throttle(handlePointerMove, 250, { trailing: false });

    window.addEventListener("dragover", throttledDrag);

    return function cleanUp() {
      throttledScroll.current = null;
      window.removeEventListener("dragover", handlePointerMove);
    };
  }, []);

  return null;
};
