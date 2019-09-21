import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import throttle from "lodash.throttle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

// MOVE to utils!
const SWATCH_WIDTH = 80;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(auto-fill, ${SWATCH_WIDTH}px);
  grid-template-rows: repeat(auto-fill, ${SWATCH_WIDTH}px);

  > * {
    height: ${SWATCH_WIDTH}px;
    width: ${SWATCH_WIDTH}px;
  }
`;

const DragHitBox = styled.li`
  position: relative;
  z-index: ${({ isDragged }) => (isDragged ? "0" : "1")};

  /* &:focus-within {
    outline: 2px solid skyblue;
  } */
`;

const UserItem = styled.div`
  pointer-events: none;
  position: absolute;
  background: ${({ hex }) => hex};
  transition: 500ms;
  transition-property: background, transform, border;
  /* opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)}; */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  ${({ isUserDragging, isDragged }) => {
    switch (true) {
      case isUserDragging:
        return css`
          border-radius: 4px;
          transform: scale(0.9);
        `;
      case isDragged:
        return css`
          border-radius: 4px;
          transform: scale(1.1);
        `;
      default:
        return;
    }
  }}
`;

const ReorderTransformation = styled.div`
  transition: 250ms;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  ${({ reorderTransform }) =>
    css`
      ${reorderTransform}
    `}

  ${({ isUserDragging }) => {
    // When a users is dragging a `<Swatch />` we want the "re-order" animation
    // (simulated via CSS `transform`'s) to run.
    //
    // When however, the user drops a `<Swatch />` we want the items to "re-order"
    // in the DOM (hard-coded NOT simulated). In that regard, if we are still
    // running `transition`s on the now redundant `transform`'s then we get a
    // flicker as the `<Swatch />` move back to their dormant state. When we apply
    // NO `transition` the drop effect feel "solid".
    switch (isUserDragging) {
      case true:
        return css`
          transition-property: transform;
        `;
      default:
        return css`
          transition-property: none;
        `;
    }
  }}
`;

const AppendItem = styled.li`
  padding: 10px;
`;

const AddButton = styled.button`
  appearance: none;
  border: 2px dashed;
  border-radius: 4px;
  border-color: ${({ isTargeted }) => (isTargeted ? "darkgreen" : "gray")};
  color: ${({ isTargeted }) => (isTargeted ? "darkgreen" : "gray")};
  cursor: pointer;
  background: ${({ isTargeted }) => (isTargeted ? "lightgreen" : "lightgray")};
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 250ms;

  ${({ isTargeted }) =>
    isTargeted
      ? css`
          border-color: darkgreen;
          color: darkgreen;
          background: lightgreen;
          transform: scale(1.05);
        `
      : css`
          border-color: gray;
          color: gray;
          background: lightgray;
        `};
`;

const Input = styled.input`
  appearance: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const Swatches = List;

export const UserSwatch = ({
  id,
  hex,
  handleChange,
  handleDragStart,
  handleDragOver,
  handleDragExit,
  handleDragEnd,
  handleDrop,
  isUserDragging,
  createReorderTransform
}) => {
  const [isDragged, setIsDragged] = useState(false);
  const swatchRef = useRef(null);
  const throttled = throttle(event => handleChange(id, event.target.value), 1000);

  return (
    <DragHitBox
      {...{ isDragged }}
      draggable
      ref={swatchRef}
      onDragStart={event => {
        // Even though we are setting the drag n drop state through React Firefox
        // will not initialise a DnD scenario without setting the `dataTransfer`.
        event.dataTransfer.setData("text/plain", "banana");
        setIsDragged(true);
        handleDragStart();
      }}
      onDragEnd={() => {
        setIsDragged(false);
        handleDragEnd();
      }}
      onDragOver={event => {
        handleDragOver();
        // MDN suggests applying `preventDefault` on specific DnD event hooks.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
        event.preventDefault();
      }}
      onDragLeave={handleDragExit}
      onDrop={event => {
        handleDrop(id);
        // MDN suggests applying `preventDefault` on specific DnD event hooks.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
        event.preventDefault();
      }}
    >
      <ReorderTransformation
        {...{ isDragged, isUserDragging }}
        reorderTransform={createReorderTransform(swatchRef.current)}
      >
        <UserItem
          {...{ hex, isDragged, isUserDragging }}

          // We do not need this right now but I am keeping here for reference for
          // future functionality.
          // import tinyColor from "tinycolor2";
          // const swatch = createSwatch(hex);
          // const createSwatch = hex => tinyColor(hex);
          // isLight={swatch.isLight()}
        />
        <Input type="color" value={hex} onChange={throttled} />
      </ReorderTransformation>
    </DragHitBox>
  );
};

export const AppendSwatch = ({ handleClick, handleDrop }) => {
  const [isTargeted, setIsTargeted] = useState(false);
  return (
    <AppendItem>
      <AddButton
        {...{ isTargeted }}
        onClick={handleClick}
        onDragOver={event => {
          // An `onDragOver` event MUST be present in order for a `onDrop` to
          // trigger!
          setIsTargeted(true);
          event.preventDefault();
        }}
        onDragLeave={() => setIsTargeted(false)}
        onMouseEnter={() => setIsTargeted(true)}
        onMouseLeave={() => setIsTargeted(false)}
        onDrop={event => {
          handleDrop();
          setIsTargeted(false);
          // MDN suggests applying `preventDefault` on specific DnD event hooks.
          // @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
          event.preventDefault();
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </AddButton>
    </AppendItem>
  );
};
