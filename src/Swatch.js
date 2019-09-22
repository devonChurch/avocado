import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import throttle from "lodash.throttle";
import tinyColor from "tinycolor2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";

// MOVE to utils!
const SWATCH_WIDTH = 80;
const BORDER_WIDTH = 3;
const FOCUS_WIDTH = 3;
const BORDER_RADUIS = 4;
const GRAY_500 = "#808080";
const GRAY_600 = "#535353";
const SPEED_500 = "250ms";
const SPEED_700 = "500ms";

const createSwatch = hex => tinyColor(hex);

const createFocusColor = hex => {
  const swatch = createSwatch(hex);
  const isLight = swatch.isLight();
  const modifier = isLight ? "darken" : "lighten";

  return swatch[modifier](30)
    .setAlpha(0.6)
    .toString();
};

const positionAbsolute = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

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

const UserItem = styled.div`
  ${positionAbsolute}
  pointer-events: none;
  border: ${BORDER_WIDTH}px solid ${({ hex }) => hex};
  background: ${({ hex }) => hex};
  color: ${({ hex }) => hex};
  transition: ${SPEED_700};
  transition-property: background, transform, border;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ hex, isUserDragging, isDragged }) => {
    switch (true) {
      case isDragged:
        return css`
          border-color: ${hex};
          border-radius: ${BORDER_RADUIS}px;
          background: ${createSwatch(hex)
            .setAlpha(0.3)
            .toString()};
          transform: scale(0.8);
        `;
      case isUserDragging:
        return css`
          border-radius: ${BORDER_RADUIS}px;
          transform: scale(0.8);
        `;
      default:
        return css`
          transition-property: transform;
        `;
    }
  }}
`;

const DragHitBox = styled.li`
  position: relative;
  z-index: ${({ isDragged }) => (isDragged ? "0" : "1")};
  transition: ${SPEED_500};
  transition-property: opacity, transform;

  ${({ isDragged }) =>
    !isDragged &&
    css`
    &:focus-within {
      z-index: 10;

      ${UserItem} {
        box-shadow: 0 0 0 ${FOCUS_WIDTH}px ${({ hex }) => createFocusColor(hex)};
        border-radius: ${BORDER_RADUIS}px;
        outline: 0;
      }
  `}
  }

  &.swatch-enter,
  &.swatch-exit {
    opacity: 0;
    transform: scale(0);
  }

  &.swatch-enter-active,
  &.swatch-exit-active {
    opacity: 1;
    transform: scale(1);
  }
`;

const ReorderTransformation = styled.div`
  ${positionAbsolute}
  transition: ${SPEED_500};

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
  /* padding: 10px; */
`;

const AddButton = styled.button`
  appearance: none;
  border: ${BORDER_WIDTH}px solid;
  border-radius: ${BORDER_RADUIS}px;
  border-color: ${GRAY_600};
  color: ${GRAY_600};
  cursor: pointer;
  display: block;
  width: 100%;
  height: 100%;
  transition: ${SPEED_500};
  transition-property: background, transform;

  ${({ isTargeted }) =>
    isTargeted
      ? css`
          background: ${createSwatch(GRAY_600)
            .setAlpha(0.6)
            .toString()};
          transform: scale(0.85);
        `
      : css`
          background: ${createSwatch(GRAY_600)
            .setAlpha(0.3)
            .toString()};
          transform: scale(0.8);
        `};

  &:focus {
    box-shadow: 0 0 0 ${FOCUS_WIDTH}px ${createFocusColor(GRAY_600)};
    outline: 0;
  }
`;

const Input = styled.input`
  ${positionAbsolute}
  appearance: none;
  opacity: 0;
`;

export const SwatchIcon = styled(FontAwesomeIcon)``;

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
      {...{ isDragged, hex }}
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
        <UserItem {...{ hex, isDragged, isUserDragging }}>
          <SwatchIcon icon={faArrowsAlt} size="2x" />
        </UserItem>
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
        <SwatchIcon icon={faPlus} size="2x" />
      </AddButton>
    </AppendItem>
  );
};
