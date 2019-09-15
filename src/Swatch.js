import React from "react";
import styled from "styled-components";
import tinyColor from "tinycolor2";
import throttle from "lodash.throttle";

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 80px);
`;

const UserItem = styled.li`
  position: relative;
  background: ${({ hex }) => hex};
  border: 10px solid;
  border-color: ${({ isLight }) => (isLight ? "black" : "white")};
  border-radius: 2px;
  height: 100%;
  width: 100%;
  transition: 100ms;
  transition-property: background, border-color;
`;

const AddItem = styled.li``;

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

export const UserSwatch = ({ id, hex, handleChange }) => {
  const swatch = createSwatch(hex);
  const throttled = throttle(
    event => handleChange(id, event.target.value),
    1000
  );
  return (
    <UserItem isLight={swatch.isLight()} hex={hex}>
      <Input type="color" value={hex} onChange={throttled} />
    </UserItem>
  );
};

export const AddSwatch = ({ handleAdd }) => {
  return (
    <AddItem>
      <button onClick={handleAdd}>Add</button>
    </AddItem>
  );
};
