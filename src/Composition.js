import React, { memo, useEffect, useRef } from "react";
import styled from "styled-components";
import tinyColor from "tinycolor2";
import throttle from "lodash.throttle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { COMP_WIDTH } from "./utils";

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
  font-family: sans-serif;
  height: 100%;
  width: 100%;
  padding: 1rem;
  position: relative;
`;

const SmallText = styled.span`
  /**
   * Force font size to be pixels (px) rather than something scaleable like rems
   * so that we can force the "worst case scenario" when creating our color
   * compositions.
   */
  display: block;
  font-size: ${({ isBold }) => `${isBold ? 14 : 16}px`};
  font-weight: ${({ isBold }) => (isBold ? "bold" : "initial")};
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

const AddDropZone = styled.div``;

export const Compositions = List;

const createAccessibilityComparison = (baseHex, contentHex) => level =>
  tinyColor.isReadable(baseHex, contentHex, { level, size: "small" });

const findAccessibilityLevel = (baseHex, contentHex) => {
  const comparison = createAccessibilityComparison(baseHex, contentHex);

  switch (true) {
    case comparison("AAA"):
      return "AAA";
    case comparison("AA"):
      return "AA";
    default:
      return "None";
  }
};

export const UserComposition = memo(({ idComp, baseHex, contentHex }) => {
  return (
    <UserItem {...{ baseHex, contentHex }}>
      <SmallText>Small Standard Text</SmallText>
      <SmallText isBold>Small Bold Text</SmallText>
      {findAccessibilityLevel(baseHex, contentHex)}
    </UserItem>
  );
});

export const AddComposition = memo(({ handleAdd }) => {
  return (
    <AddItem>
      <AddButton onClick={handleAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </AddButton>
    </AddItem>
  );
});
