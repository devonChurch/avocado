import "normalize.css";
import "drag-drop-touch";
import React, { useCallback, useMemo, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import nanoid from "nanoid";
import { createGlobalStyle } from "styled-components";
import { Swatches, UserSwatch, AppendSwatch } from "./Swatch";
import { Compositions, UserComposition, AppendComposition } from "./Composition";
import {
  SWATCH_WIDTH,
  BLACK,
  SPACE_600,
  SPEED_500,
  WHITE,
  findColorComplementFromSwatches,
  createSwatch
} from "./utils";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    padding: 50px;
  }

  #root {
    display: grid;
    grid-gap: ${SPACE_600}px;
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

const App = () => {
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** SWATCHES:   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  const [swatches, setSwatches] = useState(
    new Map([
      ["1", createSwatch("#0707FF").toHexString()],
      ["2", createSwatch("#00CAFB").toHexString()],
      ["3", createSwatch("#F8CAFB").toHexString()],
      ["4", createSwatch("#F8CA66").toHexString()],
      ["5", createSwatch("#F86D66").toHexString()],
      ["6", createSwatch("#0707ff").toHexString()],
      ["7", createSwatch("#00CAFB").toHexString()],
      ["8", createSwatch("#F8CAFB").toHexString()],
      ["9", createSwatch("#F8CA66").toHexString()],
      ["10", createSwatch("#F86D66").toHexString()]
    ])
  );

  const [dragStartId, setDragStartId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const isUserDragging = !!dragStartId;
  const dragHex = isUserDragging && swatches.get(dragStartId);

  const removeDragStartId = () => setDragStartId(null);
  const removeDragOverId = useCallback(() => setDragOverId(null), []);
  const removeDragIds = useCallback(() => {
    removeDragStartId(null);
    removeDragOverId(null);
  }, []);

  const appendSwatch = hex => setSwatches(new Map([...swatches, [createSwatchKey(), hex]]));

  const appendLastListedSwatch = () => {
    const [, lastHex] = [...swatches].pop() || [];
    appendSwatch(lastHex || BLACK);
  };

  const appendDraggedSwatch = () => {
    appendSwatch(dragHex);
    removeDragIds();
  };

  const updateUserSwatch = useCallback(
    (id, hex) => setSwatches(new Map([...swatches, [id, hex]])),
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
      setSwatches(nextSwatches);
      removeDragIds();
    },
    [swatches, dragStartId]
  );

  const createReorderTransformHandler = (...args) =>
    calculateReorderTransform([...swatches], ...args);

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** COMPOSITIONS:  ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
   ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  const [compositions, setCompositions] = useState(
    new Map([
      ["1", { baseId: "1", contentId: "2" }],
      ["2", { baseId: "3", contentId: "4" }],
      ["3", { baseId: "5", contentId: "6" }],
      ["4", { baseId: "7", contentId: "8" }]
    ])
  );

  const appendComposition = swatchIds => {
    setCompositions(new Map([...compositions, [createCompositionKey(), swatchIds]]));
  };

  const appendLastListedComposition = () => {
    const [, { baseId, contentId }] = [...compositions].pop() || [];
    appendComposition({ baseId, contentId });
  };

  const appendCompositionFromDraggedSwatch = ({ baseId, contentId }) => {
    appendComposition({
      baseId: baseId || findColorComplementFromSwatches(contentId, swatches),
      contentId: contentId || findColorComplementFromSwatches(baseId, swatches)
    });
    removeDragIds();
  };

  const updateComposition = (compId, composition) => {
    const prevComps = [...compositions];
    const compIndex = findCompositionIndexFromId(prevComps, compId);
    const nextComps = [
      ...prevComps.slice(0, compIndex),
      [compId, composition],
      ...prevComps.slice(compIndex + 1)
    ];
    setCompositions(new Map(nextComps));
  };

  return (
    <>
      <GlobalStyle />
      <TransitionGroup component={Swatches}>
        {[...swatches].map(([id, hex], swatchIndex) => {
          return (
            <CSSTransition key={id} timeout={SPEED_500} classNames="swatch">
              <UserSwatch
                key={id}
                {...{ id, hex, isUserDragging }}
                handleChange={updateUserSwatch}
                handleDragStart={setDragStartId}
                handleDragOver={setDragOverId}
                handleDragExit={removeDragOverId}
                handleDragEnd={removeDragIds}
                handleDrop={moveSwatchToNewLocation}
                createReorderTransform={createReorderTransformHandler(
                  dragStartId,
                  dragOverId,
                  swatchIndex
                )}
              />
            </CSSTransition>
          );
        })}
        <AppendSwatch
          {...{ dragHex }}
          handleClick={appendLastListedSwatch}
          handleDrop={appendDraggedSwatch}
        />
      </TransitionGroup>
      <TransitionGroup component={Compositions}>
        {[...compositions].map(comp => {
          const [compId, { baseId, contentId }] = comp;

          return (
            <CSSTransition key={compId} timeout={5000} classNames="composition">
              <UserComposition
                key={compId}
                {...{ compId, baseId, contentId, dragStartId, dragHex, isUserDragging }}
                baseHex={swatches.get(baseId)}
                contentHex={swatches.get(contentId)}
                handleDrop={updateComposition}
              />
            </CSSTransition>
          );
        })}
        <AppendComposition
          {...{ dragStartId, dragHex, isUserDragging }}
          handleClick={appendLastListedComposition}
          handleDrop={appendCompositionFromDraggedSwatch}
        />
      </TransitionGroup>
    </>
  );
};

export default App;
