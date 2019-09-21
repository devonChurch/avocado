import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import tinyColor from "tinycolor2";
import throttle from "lodash.throttle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: 0; // 10px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 80px);

  > * {
    height: 80px;
    width: 80px;
  }
`;

const DragHitBox = styled.li`
  position: relative;

  /* &:focus-within {
    outline: 2px solid skyblue;
  } */
`;

const UserItem = styled.div`
  pointer-events: none;
  position: absolute;
  background: ${({ hex }) => hex};
  /* border-color: ${({ isLight }) => (isLight ? "black" : "white")}; */
  transition: 100ms;
transition-property: background transform;
/* transition-property: background ${({ slideDirection }) =>
  slideDirection ? ", transform" : ""}; */
  opacity: ${({ isDragged }) => (isDragged ? 0.5 : 1)};
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

${({ slideDirection, swatchRef, ...props }) => {
  // prettier-ignore
  // console.log('swatch props', props)
  // xxx.nextElementSibling
  // xxx.previousElementSibling

  if (!swatchRef) return;

  const { offsetTop: currentY, offsetLeft: currentX } = swatchRef;

  switch (slideDirection) {
    case "left": {
      const { offsetTop: prevY, offsetLeft: prevX } = swatchRef.previousElementSibling;
      // const dragX = Math.abs(currentX - prevX) / 80;
      const dragX = ((prevX - currentX) / 80) * 100;
      const dragY = ((prevY - currentY) / 80) * 100;

      // console.log(``);
      // console.log(`currentY ${currentY} | prevY ${prevY} | dragY ${dragY}`);
      // console.log(`currentX ${currentX} | prevX ${prevX} | dragX ${dragX}`);

      return css`
        transform: translate(${dragX}%, ${dragY}%);
        z-index: 1;
      `;
    }

    case "right": {
      const { offsetTop: nextY, offsetLeft: nextX } = swatchRef.nextElementSibling;
      // const dragX = Math.abs(currentX - nextX) / 80;
      const dragX = ((nextX - currentX) / 80) * 100;
      const dragY = ((nextY - currentY) / 80) * 100;

      return css`
        transform: translate(${dragX}%, ${dragY}%);
        z-index: 1;
      `;
    }

    default:
      return css`
        transform: translate(0, 0);
      `;
  }
}}
`;

const AppendItem = styled.li`
  padding: 10px;
`;

// const InjectItem = styled.div`
//   height: 100%;
//   width: 0;
//   position: relative;
// `;

const AddButton = styled.button`
  appearance: none;
  border: 2px dashed gray;
  border-radius: 50%;
  background: lightgray;
  display: block;
  width: 100%;
  height: 100%;
`;

const InjectDropPoint = styled(AddButton)`
  width: 50px;
  height: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ isOver }) => (isOver ? 1 : 0)};
  transition: all 200ms;

  ${({ position }) =>
    position === "left"
      ? css`
          left: 0;
          transform: translate(-50%, -50%);
        `
      : css`
          right: 0;
          transform: translate(50%, -50%);
        `}
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

const createSwatch = hex => tinyColor(hex);

export const UserSwatch = ({
  id,
  hex,
  handleChange,
  handleDragStart,
  handleDragOver,
  handleDragExit,
  handleDrop,
  slideDirection
  // ...dropZoneHandlers
}) => {
  // const inputNode = useRef(null); //  ref={inputNode}

  const [isDragged, setIsDragged] = useState(false);
  const swatchRef = useRef(null);
  const swatch = createSwatch(hex);
  const throttled = throttle(event => handleChange(id, event.target.value), 1000);

  return (
    <DragHitBox
      draggable
      ref={swatchRef}
      onDragStart={event => {
        setIsDragged(true);
        handleDragStart(event);
      }}
      onDragEnd={() => setIsDragged(false)}
      onDragOver={event => {
        handleDragOver(event);
        event.preventDefault();
      }}
      onDragLeave={handleDragExit}
      onDrop={event => {
        handleDrop(id);
        event.preventDefault();
      }}
    >
      <UserItem
        {...{ hex, isDragged, slideDirection }}
        isLight={swatch.isLight()}
        swatchRef={swatchRef.current}
      />
      <Input type="color" value={hex} onChange={throttled} />
    </DragHitBox>
  );
};

export const AppendSwatch = ({ handleAdd }) => {
  return (
    <AppendItem>
      <AddButton onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </AddButton>
    </AppendItem>
  );
};

export const InjectSwatch = ({ id, position, handleDragOver, handleDragExit, handleDrop }) => {
  const [isOver, setIsOver] = useState(false);
  return (
    // <InjectItem {...props}>
    <InjectDropPoint
      as="div"
      isOver={isOver}
      position={position}
      onDragOver={event => {
        handleDragOver(event);
        setIsOver(true);
        event.preventDefault();
      }}
      onDragLeave={event => {
        setIsOver(false);
        handleDragExit(event);
      }}
      onDrop={event => {
        console.log("dropped", event.target);
        handleDrop(position, id);
        event.preventDefault();
      }}
    >
      <FontAwesomeIcon icon={faPlus} />
    </InjectDropPoint>
    // </InjectItem>
  );
};
