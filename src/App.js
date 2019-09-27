import "normalize.css";
import "drag-drop-touch";
import React, { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import nanoid from "nanoid";
import { createGlobalStyle } from "styled-components";
import { Swatches, UserSwatch, AppendSwatch } from "./Swatch";
import { Compositions, UserComposition, AddComposition } from "./Composition";

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
`;

// create color container
// + should be a form?

// create color item
// ✅ with color selection
// + with drag system

// create combinations container

// create combinations item
// + add state
// + add populated state
// + add drag state

// uuid
// + get color
// ✅ set color

// MOVE to utils!
const SWATCH_BLACK = "#000000";
// MOVE to utils!
const SWATCH_WIDTH = 80;
const createSwatchKey = () => nanoid();

const createIndexComparison = idOne => ([idTwo]) => idOne === idTwo;
const findSwatchIndexFromId = (swatches, id) => swatches.findIndex(createIndexComparison(id));
const createReorderTransform = (x = 0, y = 0) => `transform: translate(${x}%, ${y}%);`;

// Returns a thunk that can calculate the CSS transformation that reorders swatches
// that the user drags over based not he origin of the dragged swatch.
const calculateReorderTransform = (swatches, dragStartId, dragOverId, swatchIndex) => {
  // Only calculate if we have the relevant information.
  const isInDragOverState = dragStartId && dragOverId && dragStartId !== dragOverId;
  if (!isInDragOverState) return createReorderTransform;

  // Only calculate if the current swatch is not the originating dragging swatch.
  const dragStartIndex = findSwatchIndexFromId(swatches, dragStartId);
  const dragOverIndex = findSwatchIndexFromId(swatches, dragOverId);
  const shouldReorder = dragStartIndex !== swatchIndex;
  if (!shouldReorder) return createReorderTransform;

  // Only calculate is the current swatch falls between the originating dragged
  // swatch and the dragged over swatch. All outside swatches remain static.
  const isBeforeDragSwatches = swatchIndex >= dragStartIndex || swatchIndex >= dragOverIndex;
  const isAfterDragSwatches = swatchIndex <= dragStartIndex || swatchIndex <= dragOverIndex;
  const isBetweenDragSwatches = isBeforeDragSwatches && isAfterDragSwatches;
  if (!isBetweenDragSwatches) return createReorderTransform;

  // Based on the direction ("left" or "right") that the user is dragging we
  // reorder the swatches that fall between the dragging indexes to fill the gap
  // left from the originating dragged swatch.
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
  const [swatches, setSwatches] = useState(
    new Map([
      ["1", "#0707ff"],
      ["2", "#00CAFB"],
      ["3", "#F8CAFB"],
      ["4", "#F8CA66"],
      ["5", "#F86D66"],
      ["6", "#0707ff"],
      ["7", "#00CAFB"],
      ["8", "#F8CAFB"],
      ["9", "#F8CA66"],
      ["10", "#F86D66"]
    ])
  );

  const addNewSwatch = () => {
    const [, lastHex] = [...swatches].pop() || [];
    setSwatches(new Map([...swatches, [createSwatchKey(), lastHex || SWATCH_BLACK]]));
  };

  const updateUserSwatch = (id, hex) => setSwatches(new Map([...swatches, [id, hex]]));

  const [dragStartId, setDragStartId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const removeDragStartId = () => setDragStartId(null);
  const removeDragOverId = () => setDragOverId(null);
  const removeDragIds = () => {
    removeDragStartId(null);
    removeDragOverId(null);
  };

  const moveSwatchToNewLocation = dropId => {
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
            return shoudPrepend ? [...acc, dropSwatch, [id, hex]] : [...acc, [id, hex], dropSwatch];
          default:
            return [...acc, [id, hex]];
        }
      }, [])
    );
    setSwatches(nextSwatches);
    removeDragIds();
  };

  const duplicateAndAppendNewSwatch = () => {
    const dropHex = swatches.get(dragStartId);
    setSwatches(new Map([...swatches, [createSwatchKey(), dropHex]]));
    removeDragIds();
  };

  return (
    <>
      <GlobalStyle />
      <TransitionGroup component={Swatches}>
        {[...swatches].map(([id, hex], swatchIndex) => {
          return (
            <CSSTransition key={id} timeout={250} classNames="swatch">
              <UserSwatch
                key={id}
                {...{ id, hex }}
                handleChange={updateUserSwatch}
                handleDragStart={setDragStartId} // {() => setDragStartId(id)}
                handleDragOver={setDragOverId} // {() => setDragOverId(id)}
                handleDragExit={removeDragOverId}
                handleDragEnd={removeDragIds}
                handleDrop={moveSwatchToNewLocation}
                isUserDragging={!!dragStartId}
                createReorderTransform={calculateReorderTransform(
                  [...swatches],
                  dragStartId,
                  dragOverId,
                  swatchIndex
                )}
              />
            </CSSTransition>
          );
        })}
        <AppendSwatch handleClick={addNewSwatch} handleDrop={duplicateAndAppendNewSwatch} />
      </TransitionGroup>
      {/* <Compositions>
        {[...swatches].map(([id, hex]) => (
          <UserComposition key={id} handleChange={updateUserSwatch} {...{ id, hex }} />
        ))}
        <AddComposition handleAdd={addNewSwatch}/>
      </Compositions> */}
    </>
  );
};

export default App;
