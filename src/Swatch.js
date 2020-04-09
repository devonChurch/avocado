import React, { memo, useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLoadControl } from "eggs-benedict/hooks";
import {
  SWATCH_WIDTH,
  BORDER_WIDTH,
  BORDER_RADIUS,
  WHITE,
  GRAY_300,
  SPEED_500,
  SPEED_700,
  SCALE_300,
  SCALE_400,
  SCALE_500,
  SCALE_600,
  SPACE_300,
  SPACE_400,
  SPACE_500,
  SPACE_700,
  LUMINANCE_SHADOW_500,
  createOffsetColor,
  createTargetColor,
  createFocusState,
  createActiveColor,
  createFocusStateWithShadow,
  checkHasLowLuminance,
  resetList,
  positionAbsolute,
  deleteAnimation,
} from "./utils";

const SwatchList = styled.ul`
  ${resetList}
  display: grid;
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
  /* pointer-events: none; */
  transition-duration: ${SPEED_700}ms, ${SPEED_500}ms, ${SPEED_700}ms, ${SPEED_700}ms;
  transition-property: background, box-shadow, transform, border;

  ${({ hex, isUserDragging, isDragged, isAboutToDrag, shouldSwatchRegress, isDeleting }) => {
    let styles = "";

    /**
     * If a swatch color the user has selected has VERY LOW luminance (white or
     * close to white) then the swatch will blend into the application background
     * (and effectively dissapear).
     *
     * In that regard, we add a slightly darker border around the color to
     * differentiate it from the background (if it needs it).
     */
    if (checkHasLowLuminance(hex)) {
      styles += `
        &:after {
          ${positionAbsolute}
          border-radius: 4px;
          box-shadow: ${LUMINANCE_SHADOW_500};
          content: "";
          display: block;
          transition: opacity ${SPEED_500}ms;
        }
      `;
    }

    if (isDragged || isUserDragging || isAboutToDrag || shouldSwatchRegress || isDeleting) {
      styles += `
        border-radius: ${BORDER_RADIUS}px;
      `;
    }

    if (isUserDragging || isDeleting) {
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
    if (isDragged && isUserDragging) {
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

const swatchActiveState = css`
  z-index: 10;

  ${UserItem} {
    box-shadow: ${({ hex }) => createFocusStateWithShadow(hex)};
    border-radius: ${BORDER_RADIUS}px;
    outline: 0;

    &:after {
      opacity: 0;
    }
  }
`;

const DragHitBox = styled.div`
  position: relative;
  transition-duration: ${SPEED_500}ms;
  transition-property: opacity, transform;
  /**
   * When an item is being dragged we send it to the BACK so that ALL other
   * swatches can overlap when the "recording" animation is running. The dragging
   * swatch is also completely white and therefore CANNOT reside on top of
   * anything else.
   */
  z-index: ${({ isDragged }) => (isDragged ? "0" : "1")};

  ${({ isUserDragging, isDeleting }) =>
    !isUserDragging &&
    !isDeleting &&
    /**
     * Do NOT show these interaction states on ANY swatches when the user is
     * dragging as swatches will all be changing their `:hover` states on/off
     * throughout the dragging process.
     */
    css`
      &:focus-within,
      &:hover {
        ${swatchActiveState}
      }
    `}

  ${({ shouldSwatchRegress }) =>
    shouldSwatchRegress &&
    css`
      opacity: 0.25;
      transform: scale(${SCALE_300});
    `}

  ${({ shouldSwatchPronounce }) => shouldSwatchPronounce && swatchActiveState}

  ${({ isDeleting, hasCapacityToDelete }) =>
    isDeleting && hasCapacityToDelete && deleteAnimation(2)}

  /** React CSSTransition animation property when an item is in its DORMANT state. */
  &.swatch-enter,
  &.swatch-exit,
  &.swatch-exit-active {
    opacity: 0;
    transform: scale(0);
  }

  /** React CSSTransition animation property when an item is in its ACTIVE state. */
  &.swatch-enter-active,
  &.swatch-enter-done {
    opacity: 1;
    transform: scale(${SCALE_500});
  }
`;

const ReorderTransformation = styled.div`
  ${positionAbsolute}
  transition: ${SPEED_500}ms;

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

export const AddItem = styled.li`
  /** Force contents to take up ALL of the "cells" x/y space. */
  display: grid;
  padding: ${SPACE_400}px;
  position: relative;
  transition-duration: ${SPEED_500}ms;
  transition-property: opacity, transform;

  /** React CSSTransition animation property when the add <button /> is in NOT ACTIVE. */
  &.addItem-enter,
  &.addItem-exit {
    opacity: 0;
    transform: scale(${SCALE_300});
  }

  /** React CSSTransition animation property when the add <button /> is in IS ACTIVE. */
  &.addItem-enter-active {
    opacity: 1;
    transform: scale(${SCALE_500});
  }
`;

export const AddButton = styled.button`
  align-self: stretch;
  appearance: none;
  border: ${BORDER_WIDTH}px solid ${({ hex }) => createOffsetColor(hex)};
  border-radius: ${BORDER_RADIUS}px;
  color: ${({ hex }) => createOffsetColor(hex)};
  cursor: pointer;
  display: block;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 14px;
  height: 100%;
  justify-self: stretch;
  text-transform: uppercase;
  transition-duration: ${SPEED_500}ms;
  transition-property: box-shadow, background, opacity, transform, width, height;
  width: 100%;
  outline: 0;

  ${({ isTargeted }) =>
    isTargeted
      ? css`
          background: ${({ hex }) => createTargetColor(hex)};
          /* transform: scale(${SCALE_600}); */
          transform: translate(-${SPACE_300}px, -${SPACE_300}px);
          width: calc(100% + ${SPACE_400}px);
          height: calc(100% + ${SPACE_400}px);
        `
      : css`
          background: ${({ hex }) => hex};
          /* transform: scale(${SCALE_300}); */
        `};

  &:focus,
  &:hover {
    box-shadow: ${({ hex }) => createFocusStateWithShadow(hex)};
  }

  &:active {
    background: ${({ hex }) => createActiveColor(hex)};
  }
`;

const Input = styled.input`
  ${positionAbsolute}
  appearance: none;
  opacity: 0;
`;

export const DeleteButton = styled(AddButton)`
  align-items: center;
  display: flex;
  height: ${SPACE_700}px;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  width: ${SPACE_700}px;
  max-width: ${SPACE_700}px;

  /** React CSSTransition animation property when the add <button /> is in NOT ACTIVE. */
  &.deleteItem-enter,
  &.deleteItem-exit {
    opacity: 0;
    transform: translate(${SPACE_500}px, -${SPACE_500}px) scale(${SCALE_300});
  }

  /** React CSSTransition animation property when the add <button /> is in IS ACTIVE. */
  &.deleteItem-enter-active,
  &.deleteItem-enter-done {
    opacity: 1;
    transform: translate(${SPACE_500}px, -${SPACE_500}px) scale(${SCALE_500});
  }
`;

export const Swatches = SwatchList;

export const UserSwatch = memo(
  ({
    swatchId,
    hex,
    handleChange,
    handleDragStart,
    handleDragOver,
    handleDragExit,
    handleDragEnd,
    handleDrop,
    isUserDragging,
    isDeleting,
    handleDelete,
    hasCapacityToDelete,
    createReorderTransform,
    shouldSwatchPronounce,
    shouldSwatchRegress,
  }) => {
    const [isDragged, setIsDragged] = useState(false);
    const [isAboutToDrag, setIsAboutToDrag] = useState(false);
    const swatchRef = useRef(null);

    /**
     * We are "load controling" the color input change to our `swatch` global state.
     * Throttling/Debouncing causes the swatch hex to hang on the current value
     * until the callback finally updates. This "hanging" makes the native color
     * `<input />` constantly revert back to the swatch hex rather than the users
     * current selection.
     *
     * In that regard, we need to keep a local reference to what the user has
     * selected as their "next" hex choice so that the UI responds with a snappy
     * experience.
     */
    const [inputValue, setInputValue] = useState(hex);
    const handleLoadControledChange = useLoadControl((value) => handleChange(swatchId, value), {
      throttleDelay: 500,
    });

    return (
      <DragHitBox
        {...{
          isDragged,
          isUserDragging,
          hex,
          shouldSwatchPronounce,
          shouldSwatchRegress,
          isDeleting,
          hasCapacityToDelete,
        }}
        draggable={!isDeleting}
        ref={swatchRef}
        onDragStart={(event) => {
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
          handleDragStart(swatchId);
        }}
        onDragEnd={() => {
          setIsDragged(false);
          handleDragEnd();
        }}
        onDragOver={(event) => {
          handleDragOver(swatchId);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
        onDragLeave={handleDragExit}
        onDrop={(event) => {
          setIsDragged(false);
          handleDrop(swatchId);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
        onPointerDown={isDeleting ? undefined : () => setIsAboutToDrag(true)}
        onPointerUp={isDeleting ? undefined : () => setIsAboutToDrag(false)}
        onClick={() => {
          /**
           * Addresses an iOS issue where the native color input would not trigger
           * focus when nested inside the drag area (and all of its own touch
           * listeners). In that regard when the main wrapper is "clicked" we give
           * focus to the nested <input />.
           */
          const input = swatchRef.current.querySelector("input");
          input && input.focus();
        }}
      >
        <ReorderTransformation
          {...{ isDragged, isUserDragging }}
          reorderTransform={createReorderTransform(swatchRef.current)}
        >
          <UserItem
            {...{
              hex,
              isDragged,
              isUserDragging,
              isAboutToDrag,
              shouldSwatchRegress,
              isDeleting,
            }}
          >
            <CSSTransition
              unmountOnExit
              in={isDeleting && hasCapacityToDelete}
              timeout={SPEED_700}
              classNames="deleteItem"
            >
              <DeleteButton hex={GRAY_300} onClick={() => handleDelete(swatchId)}>
                <FontAwesomeIcon icon={faTimes} size="1x" />
              </DeleteButton>
            </CSSTransition>
          </UserItem>
          {!isDeleting && (
            <Input
              type="color"
              value={inputValue}
              onChange={(event) => {
                const { value } = event.target;
                setInputValue(value);
                handleLoadControledChange(value);
              }}
            />
          )}
        </ReorderTransformation>
      </DragHitBox>
    );
  }
);

export const AppendSwatch = memo(({ dragHex, handleClick, handleDrop }) => {
  const [isTargeted, setIsTargeted] = useState(false);

  return (
    <AddItem>
      <AddButton
        {...{ isTargeted }}
        hex={isTargeted && dragHex ? dragHex : GRAY_300}
        onClick={handleClick}
        onDragOver={(event) => {
          /*
           * An `onDragOver` event MUST be present in order for a `onDrop` to
           * trigger!
           */
          setIsTargeted(true);
          event.preventDefault();
        }}
        onDragLeave={() => setIsTargeted(false)}
        onPointerEnter={() => setIsTargeted(true)}
        onPointerLeave={() => setIsTargeted(false)}
        onDrop={(event) => {
          handleDrop();
          setIsTargeted(false);
          /*
           * MDN suggests applying `preventDefault` on specific DnD event hooks.
           * @see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API#Handle_the_drop_effect
           */
          event.preventDefault();
        }}
      >
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </AddButton>
    </AddItem>
  );
});
