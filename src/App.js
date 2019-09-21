import "normalize.css";
import React, { useState } from "react";
import nanoid from "nanoid";
import { Swatches, UserSwatch, AppendSwatch, InjectSwatch } from "./Swatch";
import { Compositions, UserComposition, AddComposition } from "./Composition";

import { createGlobalStyle } from "styled-components";

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

const createSwatchKey = () => nanoid();
const SWATCH_BLACK = "#000000";

const createIndexComparison = idOne => ([idTwo]) => idOne === idTwo;
const findSwatchIndexFromId = (swatches, id) => swatches.findIndex(createIndexComparison(id));

// Move ONLY swatches between the start and over drag indexes
// all swatches AFTER the drag index move left
// all swatches BEFORE the drag index move right

const findDragOverSlideDirection = (swatches, dragStartId, dragOverId, swatchIndex) => {
  const isInDragOverState = dragStartId && dragOverId && dragStartId !== dragOverId;
  if (!isInDragOverState) return;

  const dragStartIndex = findSwatchIndexFromId(swatches, dragStartId);
  const dragOverIndex = findSwatchIndexFromId(swatches, dragOverId);
  const isSlidableSwatch = dragStartIndex !== swatchIndex;
  if (!isSlidableSwatch) return;

  const isBetweenDragSwatches =
    (swatchIndex >= dragStartIndex || swatchIndex >= dragOverIndex) &&
    (swatchIndex <= dragStartIndex || swatchIndex <= dragOverIndex);
  if (!isBetweenDragSwatches) return;

  const direction = dragStartIndex > swatchIndex ? "right" : "left";

  return direction;

  // const dragDirection = dragOverIndex < dragStartIndex ? "left" : "right";
  // const slideDirection = swatchIndex < dragOverIndex ? "left" : "right";
  // const isDraggingLeft = dragOverIndex <= dragStartIndex; //  ? "left" : "right";
  // const shouldSlideLeft = swatchIndex <= dragOverIndex; //  ? "left" : "right";

  // if (isDraggingLeft && shouldSlideLeft) {
  //   return "right";
  // } else if (!isDraggingLeft && !shouldSlideLeft) {
  //   return "left";
  // } else {
  // }

  // console.log({ isDraggingLeft, shouldSlideLeft });

  // return swatchIndex < dragOverIndex ? "left" : "right";
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
    const [lastId, lastHex] = [...swatches].pop() || [];
    setSwatches(new Map([...swatches, [createSwatchKey(), lastHex || SWATCH_BLACK]]));
  };

  const updateUserSwatch = (id, hex) => setSwatches(new Map([...swatches, [id, hex]]));

  const [dragStartId, setDragStartId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // const injectAddSwatchDropPoint = (event, id) => {
  //   if (dragStartId === id) return;
  // };

  const removeDragStartId = () => setDragStartId(null);
  const removeDragOverId = () => setDragOverId(null);
  const removeDragIds = () => {
    removeDragStartId(null);
    removeDragOverId(null);
  };
  const dropUserSwatch = dropId => {
    // debugger;
    if (dragStartId === dropId) return;

    const prevSwatches = [...swatches];
    const dropIndex = findSwatchIndexFromId(prevSwatches, dropId); // prettier-ignore
    const dragStartIndex = findSwatchIndexFromId(prevSwatches, dragStartId); // prettier-ignore
    const shoudPrepend = dropIndex < dragStartIndex; // position === "left";
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
    // const moveSwatch = nextSwatches.get(id);
    // moveSwatch.delete(id)
    // const dropIndex = [...nextSwatches].indexOf([])
  };

  // const createDropZoneHandlers = id => ({
  //   handleDragOver: () => setDragOverId(id),
  //   handleDragExit: removeDragOverId,
  //   handleDragEnd: removeDragIds
  // });

  return (
    <>
      <GlobalStyle />
      <Swatches>
        {[...swatches].map(([id, hex], swatchIndex) => {
          // const dropZoneHandlers = createDropZoneHandlers(id);

          return (
            <UserSwatch
              key={id}
              handleChange={updateUserSwatch}
              handleDragStart={() => setDragStartId(id)}
              handleDragOver={() => setDragOverId(id)}
              handleDragExit={removeDragOverId}
              handleDrop={dropUserSwatch}
              isUserDragging={!!dragStartId}
              slideDirection={findDragOverSlideDirection(
                [...swatches],
                dragStartId,
                dragOverId,
                swatchIndex
              )}
              {...{ id, hex }}
            />
          );
        })}
        <AppendSwatch handleAdd={addNewSwatch} />
      </Swatches>
      <Compositions>
        {[...swatches].map(([id, hex]) => (
          <UserComposition key={id} handleChange={updateUserSwatch} {...{ id, hex }} />
        ))}
        <AddComposition handleAdd={addNewSwatch} />
      </Compositions>
    </>
  );
};

export default App;
