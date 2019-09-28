import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tinyColor from "tinycolor2";
import throttle from "lodash.throttle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const COMP_WIDTH = 160;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-template-rows: repeat(auto-fill, 200px);

  > * {
    height: 100px;
    width: ${COMP_WIDTH}px;
  }
`;

const UserItem = styled.li`
  background: ${({ baseHex }) => baseHex};
  color: ${({ contentHex }) => contentHex};
  height: 100%;
  width: 100%;
  position: relative;
`;

const AddItem = styled.li``;

const AddButton = styled.button`
  appearance: none;
  border: 2px dashed gray;
  background: lightgray;
  display: block;
  width: 100%;
  height: 100%;
`;

export const Compositions = List;

export const UserComposition = ({ idComp, baseHex, contentHex }) => {
  return <UserItem {...{ baseHex, contentHex }}>CONTENT</UserItem>;
};

export const AddComposition = ({ handleAdd }) => {
  return (
    <AddItem>
      <AddButton onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </AddButton>
    </AddItem>
  );
};
