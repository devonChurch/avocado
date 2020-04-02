import "normalize.css";
import "drag-drop-touch";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import nanoid from "nanoid";
import throttle from "lodash.throttle";
import { createGlobalStyle } from "styled-components";
import { Swatches, UserSwatch, AppendSwatch } from "./Swatch";
import { Compositions, UserComposition, AppendComposition } from "./Composition";
import { Header } from "./Header";
import { Scroll } from "./Scroll";
import {
  SWATCH_WIDTH,
  BLACK,
  SPACE_500,
  SPACE_600,
  SPACE_800,
  SPEED_500,
  SPEED_700,
  VIEWPORT_500,
  WHITE,
  findColorComplementFromSwatches,
  createSwatch,
  convertStateToQuery,
  convertStateFromQuery
} from "./utils";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: ${SPACE_500}px;

    @media screen and (min-width: ${VIEWPORT_500}px) {
      padding: ${SPACE_800}px;
    }
  }

  #root {
    display: grid;
    grid-gap: ${SPACE_500}px;

    @media screen and (min-width: ${VIEWPORT_500}px) {
      grid-gap: ${SPACE_600}px;
    }
  }
`;

const createSwatchKey = () => nanoid();
const createCompositionKey = createSwatchKey;

const createIndexComparison = idOne => ([idTwo]) => idOne === idTwo;
const findSwatchIndexFromId = (swatches, id) => swatches.findIndex(createIndexComparison(id));
const findCompositionIndexFromId = (compositions, id) =>
  compositions.findIndex(createIndexComparison(id));

const createReorderTransform = (x = 0, y = 0) => `transform: translate(${x}%, ${y}%);`;

/**
 * Returns a thunk that can calculate the CSS transformation that reorders swatches
 * that the user drags over based not he origin of the dragged swatch.
 */
const calculateReorderTransform = (swatches, dragStartId, dragOverId, swatchIndex) => {
  /** Only calculate if we have the relevant information. */
  const isInDragOverState = dragStartId && dragOverId && dragStartId !== dragOverId;
  if (!isInDragOverState) return createReorderTransform;

  /** Only calculate if the current swatch is not the originating dragging swatch. */
  const dragStartIndex = findSwatchIndexFromId(swatches, dragStartId);
  const dragOverIndex = findSwatchIndexFromId(swatches, dragOverId);
  const shouldReorder = dragStartIndex !== swatchIndex;
  if (!shouldReorder) return createReorderTransform;

  /**
   * Only calculate is the current swatch falls between the originating dragged
   * swatch and the dragged over swatch. All outside swatches remain static.
   */
  const isBeforeDragSwatches = swatchIndex >= dragStartIndex || swatchIndex >= dragOverIndex;
  const isAfterDragSwatches = swatchIndex <= dragStartIndex || swatchIndex <= dragOverIndex;
  const isBetweenDragSwatches = isBeforeDragSwatches && isAfterDragSwatches;
  if (!isBetweenDragSwatches) return createReorderTransform;

  /**
   * Based on the direction ("left" or "right") that the user is dragging we
   * reorder the swatches that fall between the dragging indexes to fill the gap
   * left from the originating dragged swatch.
   */
  return function positionReorderTransform(prevNode) {
    const isDraggedRight = dragStartIndex > swatchIndex;
    const siblingTarget = isDraggedRight ? "nextElementSibling" : "previousElementSibling";
    const nextNode = prevNode[siblingTarget];
    const { offsetTop: prevY, offsetLeft: prevX } = prevNode;
    const { offsetTop: nextY, offsetLeft: nextX } = nextNode;
    const dragX = ((nextX - prevX) / SWATCH_WIDTH) * 100;
    const dragY = ((nextY - prevY) / SWATCH_WIDTH) * 100;

    return createReorderTransform(dragX, dragY);
  };
};

const useThrottledState = (initialState, delay) => {
  const [isPrepped, setIsPrepped] = useState(false);
  const [state, setState] = useState(initialState);
  const throttled = useRef();

  useEffect(() => {
    const handleUpdate = newState => setState(newState);
    throttled.current = throttle(handleUpdate, delay, { trailing: false });

    // Once the throttler has been setup we toggle a flag to ensure that we return
    // the throttled state "updater"
    if (!isPrepped) {
      setIsPrepped(true);
    }

    // Destroy persistent throttle reference on unmount.
    return () => throttled.current.cancel();

    // Force the effect to ONLY run on init so as NOT to recreate the thriller
    // setup (which would be super bad).
  }, []);

  return [
    state,
    // If we have NOT prepped the throttler yet then just send back the "immediate"
    // setState reference.
    isPrepped ? throttled.current : setState
  ];
};

const useThrottler = callback => {
  const throttle = React.useRef();

  React.useEffect(() => {
    const raf = window.requestAnimationFrame;
    let isRunning = false;
    let tail;

    // if running
    // - save callback for later
    // if NOT running
    // - exe callback imediately

    throttle.current = (...args) => {
      if (!isRunning) {
        isRunning = true;
        raf(() => {
          callback(...args);
          tail && tail();
          isRunning = false;
        });

      } else {
        tail = () => console.log('tail') || callback(...args)
      }
    };

    return () => cancelAnimationFrame(raf);
  });

  return throttle.current || callback;
};

const App = () => {
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** SWATCHES:   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

  // Se swap out the "vanilla" useState hook for a custom implementation that
  // throttles the update of the "swatches" references. The swatch state is the
  // catalyst for performant heavy re-renders (think hundreds of hex updates as
  // you drag the native color slider). In that regard, we throttle the amount
  // the swatches state can be updated.
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const [swatches, setSwatches] = useState(new Map([]));
  console.log({swatches, setSwatches});
  // const [swatches, setSwatches] = useThrottledState(new Map([]), 1000);

  const setThrottledSwatches = useThrottler(setSwatches);

  const [dragStartId, setDragStartId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const isUserDragging = !!dragStartId;
  const dragHex = isUserDragging && swatches.get(dragStartId);

  const removeDragStartId = () => setDragStartId(null);
  const removeDragOverId = useCallback(() => setDragOverId(null), []);
  const removeDragIds = useCallback(() => {
    removeDragStartId(null);
    removeDragOverId(null);
  }, [removeDragOverId]);

  const appendSwatch = hex => setThrottledSwatches(swatches => new Map([...swatches, [createSwatchKey(), hex]]));

  const appendLastListedSwatch = () => {
    const [, lastHex] = [...swatches].pop() || [];
    appendSwatch(lastHex || BLACK);
  };

  const appendDraggedSwatch = () => {
    appendSwatch(dragHex);
    removeDragIds();
  };

  const updateUserSwatch = useCallback(
    (id, hex) => setThrottledSwatches((swatches) => new Map([...swatches, [id, hex]])),
    [swatches]
  );

  const moveSwatchToNewLocation = useCallback(
    dropId => {
      if (dragStartId === dropId) return;

      const prevSwatches = [...swatches];
      const dropIndex = findSwatchIndexFromId(prevSwatches, dropId);
      const dragStartIndex = findSwatchIndexFromId(prevSwatches, dragStartId);
      const shoudPrepend = dropIndex < dragStartIndex;
      const dropSwatch = [dragStartId, swatches.get(dragStartId)];
      const nextSwatches = new Map(
        prevSwatches.reduce((acc, [id, hex]) => {
          switch (true) {
            case id === dragStartId:
              return acc; // Remove the swatch from its orignal location.
            case id === dropId:
              return shoudPrepend
                ? [...acc, dropSwatch, [id, hex]]
                : [...acc, [id, hex], dropSwatch];
            default:
              return [...acc, [id, hex]];
          }
        }, [])
      );
      setThrottledSwatches(nextSwatches);
      removeDragIds();
    },
    [swatches, dragStartId, removeDragIds]
  );

  const createReorderTransformHandler = (...args) =>
    calculateReorderTransform([...swatches], ...args);

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** COMPOSITIONS:  ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  const [compositions, setCompositions] = useState([]);

  const [activeCompositionId, setActiveCompositionId] = useState(null);
  const removeActiveCompositionId = () => setActiveCompositionId(null);

  const setSwatchAppearanceAgainstCompositionTarget = swatchId => {
    if (!activeCompositionId) return;
    const composition = compositions.get(activeCompositionId);
    const hasBase = composition.baseId === swatchId;
    const hasContent = composition.contentId === swatchId;
    const shouldSwatchPronounce = hasBase || hasContent;
    const shouldSwatchRegress = !shouldSwatchPronounce && activeCompositionId;

    return { shouldSwatchPronounce, shouldSwatchRegress };
  };

  const appendComposition = ({ baseId, contentId } = {}) => {
    const compositionIds = {
      baseId: baseId || findColorComplementFromSwatches(contentId, swatches),
      contentId: contentId || findColorComplementFromSwatches(baseId, swatches)
    };
    setCompositions(new Map([...compositions, [createCompositionKey(), compositionIds]]));
  };

  const appendLastListedComposition = () => {
    const [, compositionIds] = [...compositions].pop() || [];
    appendComposition(compositionIds);
  };

  const appendCompositionFromDraggedSwatch = compositionIds => {
    appendComposition(compositionIds);
    removeDragIds();
  };

  const updateComposition = useCallback(
    (compId, composition) => {
      const prevComps = [...compositions];
      const compIndex = findCompositionIndexFromId(prevComps, compId);
      const nextComps = [
        ...prevComps.slice(0, compIndex),
        [compId, composition],
        ...prevComps.slice(compIndex + 1)
      ];
      setCompositions(new Map(nextComps));
    },
    [compositions]
  );

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** QUERY STRING:  ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

  useEffect(() => {
    const { swatches, compositions } = convertStateFromQuery(window.location.search);

    setThrottledSwatches(swatches);
    setCompositions(compositions);
  }, []);

  useEffect(() => {
    const search = convertStateToQuery(swatches, compositions);
    const { protocol, host, pathname } = window.location;
    const url = `${protocol}//${host}${pathname}${search}`;

    window.history.replaceState({}, "", url);
  }, [swatches, compositions]);

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** DELETE:  ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDeleteToggle = () => setIsDeleting(!isDeleting);

  const deleteSwatch = useCallback(
    swatchId => {
      const prevSwatches = [...swatches];
      const swatchIndex = findSwatchIndexFromId(prevSwatches, swatchId);
      const nextSwatches = [
        ...prevSwatches.slice(0, swatchIndex),
        ...prevSwatches.slice(swatchIndex + 1)
      ];
      setThrottledSwatches(new Map(nextSwatches));
    },
    [swatches]
  );

  const deleteComposition = useCallback(
    compId => {
      const prevComps = [...compositions];
      const compIndex = findCompositionIndexFromId(prevComps, compId);
      const nextComps = [...prevComps.slice(0, compIndex), ...prevComps.slice(compIndex + 1)];
      setCompositions(new Map(nextComps));
    },
    [compositions]
  );

  const hasEnoughSwatchesToDelete = swatches.size > 2;
  const hasEnoughCompositionsToDelete = compositions.size > 1;

  const checkIsSwatchInAnyComposition = (() => {
    const activeSwatchIds = [...compositions.values()].reduce(
      (acc, { baseId, contentId }) => [...acc, baseId, contentId],
      []
    );

    return swatchId => activeSwatchIds.includes(swatchId);
  })();

  return (
    <>
      <GlobalStyle />
      <Header {...{ isDeleting, handleDeleteToggle }} />
      {isUserDragging && <Scroll />}
      <TransitionGroup component={Swatches}>
        {[...swatches].map(([swatchId, hex], swatchIndex) => (
          <CSSTransition key={swatchId} timeout={SPEED_700} classNames="swatch">
            <UserSwatch
              key={swatchId}
              {...{
                swatchId,
                hex,
                isUserDragging,
                isDeleting,
                ...setSwatchAppearanceAgainstCompositionTarget(swatchId)
              }}
              hasCapacityToDelete={
                hasEnoughSwatchesToDelete && !checkIsSwatchInAnyComposition(swatchId)
              }
              handleChange={updateUserSwatch}
              handleDragStart={setDragStartId}
              handleDragOver={setDragOverId}
              handleDragExit={removeDragOverId}
              handleDragEnd={removeDragIds}
              handleDrop={moveSwatchToNewLocation}
              handleDelete={deleteSwatch}
              createReorderTransform={createReorderTransformHandler(
                dragStartId,
                dragOverId,
                swatchIndex
              )}
            />
          </CSSTransition>
        ))}
        <>
          {/**
           * Use a <Fragment /> to protect the "append" <CSSTransitions /> from
           * absorbing the parent <TransitionGroup />.
           */
          isDeleting ? (
            /**
             * Add in a placeholder so that the missing space does NOT cause
             * aggressive reflow.
             */
            <div />
          ) : (
            <CSSTransition unmountOnExit in={!isDeleting} timeout={SPEED_700} classNames="addItem">
              <AppendSwatch
                {...{ dragHex }}
                handleClick={appendLastListedSwatch}
                handleDrop={appendDraggedSwatch}
              />
            </CSSTransition>
          )}
        </>
      </TransitionGroup>
      <TransitionGroup component={Compositions}>
        {[...compositions].map(([compId, { baseId, contentId }]) => (
          <CSSTransition key={compId} timeout={SPEED_700} classNames="composition">
            <UserComposition
              key={compId}
              {...{
                compId,
                baseId,
                contentId,
                dragStartId,
                dragHex,
                isUserDragging,
                isDeleting,
                setActiveCompositionId,
                removeActiveCompositionId
              }}
              hasCapacityToDelete={hasEnoughCompositionsToDelete}
              baseHex={swatches.get(baseId)}
              contentHex={swatches.get(contentId)}
              handleDrop={updateComposition}
              handleDelete={deleteComposition}
            />
          </CSSTransition>
        ))}
        <>
          {isDeleting ? (
            <div />
          ) : (
            <CSSTransition unmountOnExit in={!isDeleting} timeout={SPEED_700} classNames="addItem">
              <AppendComposition
                {...{ dragStartId, dragHex, isUserDragging }}
                handleClick={appendLastListedComposition}
                handleDrop={appendCompositionFromDraggedSwatch}
              />
            </CSSTransition>
          )}
        </>
      </TransitionGroup>
    </>
  );
};

export default App;
