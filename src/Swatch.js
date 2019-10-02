import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
import throttle from "lodash.throttle";
import tinyColor from "tinycolor2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import {
  SWATCH_WIDTH,
  BORDER_WIDTH,
  BORDER_RADUIS,
  WHITE,
  GRAY_300,
  GRAY_500,
  GRAY_900,
  SPEED_500,
  SPEED_700,
  SCALE_300,
  SCALE_400,
  SCALE_500,
  createFocusState,
  createFocusStateWithShadow
} from "./utils";

const positionAbsolute = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const List = styled.ul`
  display: grid;
  list-style: none;
  margin: 0;
  padding: 0;
  grid-gap: 0;
  grid-template-rows: repeat(auto-fill, ${SWATCH_WIDTH}px);
  grid-template-columns: repeat(auto-fill, ${SWATCH_WIDTH}px);

  /** Regardless of content we ALWAYS conform to the rigid grid system dimensions. */
  > * {
    height: ${SWATCH_WIDTH}px;
    width: ${SWATCH_WIDTH}px;
  }
`;

const UserItem = styled.div`
  ${positionAbsolute}
  background: ${({ hex }) => hex};
  pointer-events: none;
  transition-duration: ${SPEED_700}, ${SPEED_500}, ${SPEED_700}, ${SPEED_700};
  transition-property: background, box-shadow, transform, border;

  ${({ hex, isUserDragging, isDragged, isAboutToDrag }) => {
    let styles = "";

    if (isDragged || isUserDragging || isAboutToDrag) {
      styles += `
        border-radius: ${BORDER_RADUIS}px;
      `;
    }

    if (isDragged || isUserDragging) {
      styles += `
        transform: scale(${SCALE_300});
      `;
    }

    /**
     * We want the original location where the swatch was dragged from to be an
     * "empty" slot (by default it just sits there).
     *
     * + If we change `opacity: 0;` then that ALSO changes the dragged item
     *   attached to the users mouse position.
     *
     * + Changing `background: white;` ONLY changes the placeholder "dormant"
     *   swatch =)
     */
    if (isDragged) {
      styles += `
        background: ${WHITE};
      `;
    }

    /**
     * The browser will take a "snapshot" or the dragged swatch IMMEDIATELY after
     * dragging starts. The "snapshot" is a square around the DOM element and
     * crops out anything NOT in that box (like `outline` and `box-shadow`). In
     * that regard we need to have the dragging swatch BEFORE dragging starts.
     *
     * To do this we remove and `transition-duration` (so that things happen
     * immediately - getting caught half way through a transition looks disjointed)
     * and change the following:
     *
     * + `scale` shrink the main item (including `:focus` `box-shadow`) INSIDE
     *   the crop box. This actually look pretty good as it simulates an "on press"
     *   aesthetic.
     *
     * + Remove the drop shadow as it bleeds off the swatch crop area and can be
     *   seen in the swatch rounded corners.
     */
    if (isAboutToDrag) {
      styles += `
        box-shadow: ${({ hex }) => createFocusState(hex)} !important;
        transition-duration: 0ms;
        transform: scale(${SCALE_400});
      `;
    }

    return css`
      ${styles}
    `;
  }}
`;

const DragHitBox = styled.li`
  position: relative;
  transition-duration: ${SPEED_500};
  transition-property: opacity, transform;
  /**
   * When an item is being dragged we send it to the BACK so that ALL other
   * swatches can overlap when the "recording" animation is running. The dragging
   * swatch is also completely white and therefore CANNOT reside on top of
   * anything else.
   */
  z-index: ${({ isDragged }) => (isDragged ? "0" : "1")};

  ${({ isUserDragging }) =>
    !isUserDragging &&
    /**
     * Do NOT show these interaction states on ANY swatches when the user is
     * dragging as swatches will all be changing their `:hover` states on/off
     * throughout the dragging process.
     */
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

  /** React CSSTransition animation property when an item is in its DORMANT state. */
  &.swatch-enter,
  &.swatch-exit {
    opacity: 0;
    transform: scale(0);
  }

  /** React CSSTransition animation property when an item is in its ACTIVE state. */
  &.swatch-enter-active,
  &.swatch-exit-active {
    opacity: 1;
    transform: scale(${SCALE_500});
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
    /*
     * When a users is dragging a `<Swatch />` we want the "re-order" animation
     * (simulated via CSS `transform`'s) to run.
     *
     * When however, the user drops a `<Swatch />` we want the items to "re-order"
     * in the DOM (hard-coded NOT simulated). In that regard, if we are still
     * running `transition`s on the now redundant `transform`'s then we get a
     * flicker as the `<Swatch />` move back to their dormant state. When we apply
     * NO `transition` the drop effect feel "solid".
     */
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

const AddButton = styled.button`
  appearance: none;
  border: ${BORDER_WIDTH}px solid ${GRAY_900};
  border-radius: ${BORDER_RADUIS}px;
  color: ${GRAY_900};
  cursor: pointer;
  display: block;
  height: 100%;
  transition-duration: ${SPEED_500};
  transition-property: box-shadow, background, transform;
  width: 100%;

  ${({ isTargeted }) =>
    isTargeted
      ? css`
          background: ${GRAY_500};
          transform: scale(${SCALE_400});
        `
      : css`
          background: ${GRAY_300};
          transform: scale(${SCALE_300});
        `};

  &:focus,
  &:hover {
    box-shadow: ${createFocusStateWithShadow(GRAY_300)};
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

export const UserSwatch = memo(
  ({
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

    return (
      <DragHitBox
        {...{ isDragged, isUserDragging, hex }}
        key={`${id}_DragHitBox`}
        draggable
        ref={swatchRef}
        onDragStart={event => {
          setIsAboutToDrag(false);
          /*
           * Even though we are setting the drag n drop state through React Firefox
           * will not initialise a DnD scenario without setting the `dataTransfer`.
           */
          event.dataTransfer.setData("text/plain", "banana");

          /**
           * Set the drag image that will "stick" to the users mouse position during
           * the entire drag sequence.
           */
          const offset = SWATCH_WIDTH / 2;
          event.dataTransfer.setDragImage(swatchRef.current, offset, offset);

          setIsDragged(true);
          handleDragStart(id);
        }}
        onDragEnd={() => {
          setIsDragged(false);
          handleDragEnd();
        }}
        onDragOver={event => {
          handleDragOver(id);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
        onDragLeave={handleDragExit}
        onDrop={event => {
          handleDrop(id);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
        onMouseDown={() => setIsAboutToDrag(true)}
        onMouseUp={() => setIsAboutToDrag(false)}
      >
        <ReorderTransformation
          {...{ isDragged, isUserDragging }}
          key={`${id}_ReorderTransformation`}
          reorderTransform={createReorderTransform(swatchRef.current)}
        >
          <UserItem key={`${id}_UserItem`} {...{ hex, isDragged, isUserDragging, isAboutToDrag }} />
          <Input
            key={`${id}_Input`}
            type="color"
            value={hex}
            onChange={event => handleChange(id, event.target.value)}
          />
        </ReorderTransformation>
      </DragHitBox>
    );
  }
);

export const AppendSwatch = memo(({ handleClick, handleDrop }) => {
  const [isTargeted, setIsTargeted] = useState(false);
  return (
    <li>
      <AddButton
        {...{ isTargeted }}
        onClick={handleClick}
        onDragOver={event => {
          /*
           * An `onDragOver` event MUST be present in order for a `onDrop` to
           * trigger!
           */
          setIsTargeted(true);
          event.preventDefault();
        }}
        onDragLeave={() => setIsTargeted(false)}
        onMouseEnter={() => setIsTargeted(true)}
        onMouseLeave={() => setIsTargeted(false)}
        onDrop={event => {
          handleDrop();
          setIsTargeted(false);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
      >
        <SwatchIcon icon={faPlus} size="2x" />
      </AddButton>
    </li>
  );
});
