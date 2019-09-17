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
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 80px);

  > * {
    height: 80px;
    width: 80px;
  }
`;

const UserItem = styled.li`
  position: relative;
  background: ${({ hex }) => hex};
  border: 0; // 10px solid;
  border-color: ${({ isLight }) => (isLight ? "black" : "white")};
  border-radius: 50%;
  transition: 100ms;
  transition-property: background, border-color;
  opacity: ${({ isDragged }) => (isDragged ? 0.25 : 1)};

  &:focus-within {
    outline: 2px solid skyblue;
  }
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
  hasAddHandles
  // ...dropZoneHandlers
}) => {
  // const inputNode = useRef(null); //  ref={inputNode}

  const [isDragged, setIsDragged] = useState(false);
  const swatch = createSwatch(hex);
  const throttled = throttle(
    event => handleChange(id, event.target.value),
    1000
  );

  return (
    <UserItem
      draggable
      hex={hex}
      isDragged={isDragged}
      isLight={swatch.isLight()}
      onDragStart={event => {
        setIsDragged(true);
        handleDragStart(event);
      }}
      onDragEnd={() => setIsDragged(false)}
      // onDragOver={handleDragOver}
      // onDragLeave={handleDragExit}
      // onMouseLeave={handleDragExit}
      // onDrop={handleDragEnd}
      // onDragStart={event => {
      //   console.log("dragstart", event, event.target);
      // }}
    >
      <Input type="color" value={hex} onChange={throttled} />
      {hasAddHandles && (
        <>
          <InjectSwatch
            position="left"
            {...{ id, handleDragOver, handleDragExit, handleDrop }}
          />
          <InjectSwatch
            position="right"
            {...{ id, handleDragOver, handleDragExit, handleDrop }}
          />
        </>
      )}
    </UserItem>
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

export const InjectSwatch = ({
  id,
  position,
  handleDragOver,
  handleDragExit,
  handleDrop
}) => {
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
