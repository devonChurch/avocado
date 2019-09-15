import React from "react";
import styled from "styled-components";
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
  border: 10px solid;
  border-color: ${({ isLight }) => (isLight ? "black" : "white")};
  border-radius: 2px;
  transition: 100ms;
  transition-property: background, border-color;

  &:focus-within {
    outline: 2px solid skyblue;
  }
`;

const AddItem = styled.li`
  padding: 10px;
`;

const AddButton = styled.button`
  appearance: none;
  border: 2px dashed gray;
  background: lightgray;
  display: block;
  width: 100%;
  height: 100%;
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
      <AddButton onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </AddButton>
    </AddItem>
  );
};
