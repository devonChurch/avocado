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

const FOCUS_SHADOW = (() => {
  const swatch = createSwatch("#000").setAlpha(0.25);
  return `0 0 13px ${FOCUS_WIDTH}px ${swatch}`;
})();

const createFocusColor = hex => {
  const swatch = createSwatch(hex);
  const isLight = swatch.isLight();
  const modifier = isLight ? "darken" : "lighten";

  return swatch[modifier](20)
    .setAlpha(0.6)
    .toString();
};

const createFocusState = hex => createFocusColor(hex);
const createFocusStateWithShadow = hex =>
  `${FOCUS_SHADOW}, 0 0 0 ${FOCUS_WIDTH}px ${createFocusColor(hex)}`;

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
  transition-property: background, box-shadow, transform, border;
  transition-duration: ${SPEED_700}, ${SPEED_500}, ${SPEED_700}, ${SPEED_700};

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ hex, isUserDragging, isDragged, isAboutToDrag }) => {
    switch (true) {
      case isDragged:
        return css`
          border-color: white;
          background: white;
          border-radius: ${BORDER_RADUIS}px;
          transform: scale(0.8);
        `;
      case isAboutToDrag:
        return css`
          border-color: ${hex};
          border-radius: ${BORDER_RADUIS}px;
          transition-duration: 0ms;
          transform: scale(0.9);
        `;
      case isUserDragging:
        return css`
          border-radius: ${BORDER_RADUIS}px;
          transform: scale(0.8);
        `;
      default:
        return css``;
    }
  }}
`;

const DragHitBox = styled.li`
  position: relative;
  z-index: ${({ isDragged }) => (isDragged ? "0" : "1")};
  transition: ${SPEED_500};
  transition-property: opacity, transform;

  ${({ isUserDragging }) =>
    !isUserDragging &&
    css`
      &:focus-within,
      &:hover {
        z-index: 10;

        ${UserItem} {
          box-shadow: ${({ hex }) => createFocusStateWithShadow(hex)};
          border-radius: ${BORDER_RADUIS}px;
          outline: 0;
        }
      }
    `}

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
  transition-property: box-shadow, background, transform;

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

  &:focus,
  &:hover {
    box-shadow: ${createFocusStateWithShadow(GRAY_600)};
    outline: 0;
  }
`;

const Input = styled.input`
  ${positionAbsolute}
  appearance: none;
  opacity: 0;
`;

export const DragSwatch = styled.div`
  background: red;
  border-radius: ${BORDER_RADUIS}px;
  height: ${SWATCH_WIDTH}px;
  width: ${SWATCH_WIDTH}px;
`;

export const DragItem = styled.div`
${positionAbsolute}
  background: ${({ hex }) => hex};
  border-radius: ${BORDER_RADUIS}px;
  height: ${SWATCH_WIDTH}px;
  width: ${SWATCH_WIDTH}px;
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
  const [isAboutToDrag, setIsAboutToDrag] = useState(false);
  const swatchRef = useRef(null);
  const dragRef = useRef(null);
  const throttled = throttle(event => handleChange(id, event.target.value), 1000);

  return (
    <DragHitBox
      {...{ isDragged, isUserDragging, hex }}
      draggable
      ref={swatchRef}
      onDragStart={event => {
        setIsAboutToDrag(false);
        // Even though we are setting the drag n drop state through React Firefox
        // will not initialise a DnD scenario without setting the `dataTransfer`.
        event.dataTransfer.setData("text/plain", "banana");

        // var img = new Image();
        // img.src = "example.gif";
        // img.src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><style>.a{fill:#ddedee;}.b{fill:#f16421;}</style></defs><title>squirrel-touch-icon</title><rect class="a" width="512" height="512"/><path class="b" d="M94,172.5c0-54.3,48.8-82.7,150.6-92L239.9,43h32.2l-4.7,37.6c101.8,9.3,150.5,37.7,150.5,92,0,31.8-24.3,39.7-25.3,40.1l-134-70.8-139.4,71v-0.2S94,205,94,172.5M278.8,456.1c-5.5,1.3-16.5,3.9-22.8,13.6-6.2-10.2-17.3-12.3-22.8-13.6-104.1-28.7-125.4-105.8-115-229.9l140.5-71.6,135.2,71.4c10.4,124.3-10.9,201.4-115,230.1"/></svg>`;
        // img.src = "https://www.squirrel.co.nz/media/2056/homepage-banner2.png";
        // event.dataTransfer.setDragImage(img, 10, 10);

        // const shape = document.createElement("div");
        // shape.style.width = "50px";
        // shape.style.height = "50px";
        // shape.style.background = "red";
        // document.body.appendChild(shape);

        // const shape = document.getElementById("drag-swatch");
        // shape.style.opacity = "1";
        // console.log(shape);
        // event.dataTransfer.setDragImage(shape, 10, 10);
        // shape.style.opacity = "0";

        // console.log(dragRef.current);
        // event.dataTransfer.setDragImage(dragRef.current, 10, 10);

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
      onMouseDown={() => setIsAboutToDrag(true)}
      onMouseUp={() => setIsAboutToDrag(false)}
    >
      <ReorderTransformation
        {...{ isDragged, isUserDragging }}
        reorderTransform={createReorderTransform(swatchRef.current)}
      >
        <UserItem {...{ hex, isDragged, isUserDragging, isAboutToDrag }}>
          {/* <DragItem ref={dragRef} {...{ hex, isDragged, isUserDragging }}> */}
          {/* <SwatchIcon icon={faArrowsAlt} size="2x" /> */}
          {/* </DragItem> */}
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
