import "normalize.css";
import React, { useState } from "react";
import nanoid from "nanoid";
import { Swatches, UserSwatch, AddSwatch } from "./Swatch";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
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

  return (
    <>
      <GlobalStyle />
      <Swatches>
        {[...swatches].map(([id, hex]) => (
          <UserSwatch
            key={id}
            handleChange={updateUserSwatch}
            {...{ id, hex }}
          />
        ))}
        <AddSwatch handleAdd={addNewSwatch} />
      </Swatches>
    </>
  );
};

export default App;
