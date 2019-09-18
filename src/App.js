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

const App = () => {
  const [swatches, setSwatches] = useState(new Map());

  const addNewSwatch = () => {
    const [lastId, lastHex] = [...swatches].pop() || [];
    setSwatches(
      new Map([...swatches, [createSwatchKey(), lastHex || SWATCH_BLACK]])
    );
  };

  const updateUserSwatch = (id, hex) =>
    setSwatches(new Map([...swatches, [id, hex]]));

  const [dragStartId, setDragStartId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const injectAddSwatchDropPoint = (event, id) => {
    if (dragStartId === id) return;
  };

  const removeDragStartId = () => setDragStartId(null);
  const removeDragOverId = () => setDragOverId(null);
  const removeDragIds = () => {
    removeDragStartId(null);
    removeDragOverId(null);
  };
  const moveUserSwatch = moveToId => {
    // debugger;
    if (dragStartId === moveToId) return;

    const swatchesArray = [...swatches];
    const createIndexComparison = compareId => ([id]) => id === compareId;
    const moveToIndex = swatchesArray.findIndex(createIndexComparison(moveToId)); // prettier-ignore
    const dragStartIndex = swatchesArray.findIndex(createIndexComparison(dragStartId)); // prettier-ignore
    const shoudPrepend = moveToIndex < dragStartIndex; // position === "left";
    const movedSwatch = [dragStartId, swatches.get(dragStartId)];
    const movedSwatches = new Map(
      swatchesArray.reduce((acc, [id, hex]) => {
        switch (true) {
          case id === dragStartId:
            return acc; // Remove the swatch from its orignal location.
          case id === moveToId:
            return shoudPrepend
              ? [...acc, movedSwatch, [id, hex]]
              : [...acc, [id, hex], movedSwatch];
          default:
            return [...acc, [id, hex]];
        }
      }, [])
    );
    setSwatches(movedSwatches);
    // const moveSwatch = nextSwatches.get(id);
    // moveSwatch.delete(id)
    // const moveToIndex = [...nextSwatches].indexOf([])
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
        {[...swatches].map(([id, hex]) => {
          // const dropZoneHandlers = createDropZoneHandlers(id);

          return (
            <UserSwatch
              key={id}
              handleChange={updateUserSwatch}
              handleDragStart={() => setDragStartId(id)}
              handleDragOver={() => setDragOverId(id)}
              handleDragExit={removeDragOverId}
              handleDrop={moveUserSwatch}
              hasAddHandles={dragStartId && dragStartId !== id}
              {...{ id, hex }}
            >
              {/* {dragStartId && dragStartId !== id && <InjectSwatch {...dropZoneHandlers} />} */}
            </UserSwatch>
          );
        })}
        <AppendSwatch handleAdd={addNewSwatch} />
      </Swatches>
      <Compositions>
        {[...swatches].map(([id, hex]) => (
          <UserComposition
            key={id}
            handleChange={updateUserSwatch}
            {...{ id, hex }}
          />
        ))}
        <AddComposition handleAdd={addNewSwatch} />
      </Compositions>
    </>
  );
};

export default App;
