import React, { memo, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import tinyColor from "tinycolor2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faCheckCircle,
  faCalendarAlt,
  faCommentDots,
  faStar,
  faTrashAlt
} from "@fortawesome/free-regular-svg-icons";
import {
  BLACK,
  GRAY_300,
  GRAY_900,
  COMP_WIDTH,
  COMP_HEIGHT,
  BORDER_RADIUS,
  BORDER_WIDTH,
  SCALE_600,
  SPACE_600,
  SPACE_800,
  SPEED_500,
  SPEED_700,
  LUMINANCE_SHADOW_500,
  createSwatch,
  checkHasLowLuminance,
  resetList,
  positionAbsolute
} from "./utils";
import { AppendSwatch } from "./Swatch";

const CompList = styled.ul`
  ${resetList}
  display: grid;
  grid-gap: ${SPACE_600}px;
  grid-template-columns: repeat(auto-fit, minmax(${COMP_WIDTH}px, auto));
  /* grid-template-rows: repeat(auto-fill, minmax(${COMP_HEIGHT}px, auto)); */

  > * {
    min-height: ${COMP_HEIGHT}px;
    min-width: ${COMP_WIDTH}px;
  }
`;

const IconList = styled.ul`
  ${resetList}

  display: grid;
  grid-template-columns: repeat(auto-fit, 1rem);
  grid-gap: ${SPACE_600}px;
`;

const DividerList = styled.ul`
  ${resetList}
  display: grid;
  grid-gap: ${SPACE_600}px;
  grid-template-columns: 1fr;
`;

const ResultList = styled.ul`
  ${resetList}
  display: flex;
  border-radius: 0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px;
  background: ${GRAY_300};
  color: ${GRAY_900};
  justify-content: space-between;
  padding: ${SPACE_600}px;
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  align-items: center;

  > * {
    display: block;
  }
`;

const Character = styled.span`
  opacity: ${({ children }) => (children === "A" ? 1 : 0.25)};
`;

const UserItem = styled.li`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Examples = styled.div`
  border-radius: ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: ${SPACE_600}px;
  background: ${({ baseHex }) => baseHex};
  color: ${({ contentHex }) => contentHex};
  padding: ${SPACE_600}px;
  position: relative;
  font-family: sans-serif;
  transition: background ${SPEED_700};

  > * {
    display: block;
  }

  ${({ baseHex }) => {
    /**
     * Correspond with the <Swatch /> luminance aesthetic to differentiate VERY
     * "light" colors from the application background.
     */
    if (checkHasLowLuminance(baseHex)) {
      return css`
        &:after {
          ${positionAbsolute}
          border-radius: ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0;
          box-shadow: ${LUMINANCE_SHADOW_500};
          content: "";
          display: block;
        }
      `;
    }
  }}
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

// const AddButton = styled.button`
//   appearance: none;
//   border: 2px dashed gray;
//   background: lightgray;
//   display: block;
//   width: 100%;
//   height: 100%;
// `;

const AddDropZone = styled.div``;

const Divider = styled.div`
  border-radius: ${BORDER_RADIUS}px;
  height: ${({ height }) => `${height}px`};
  background-image: linear-gradient(to right, currentColor, transparent);
`;

export const Compositions = CompList;

const createContrastPercentage = (baseHex, contentHex) => {
  const ratio = tinyColor.readability(baseHex, contentHex);
  const percentage = (ratio / 21) * 100;

  return Math.round(percentage);
};

const createAccessibilityComparison = (baseHex, contentHex) => level =>
  tinyColor.isReadable(baseHex, contentHex, { level, size: "small" });

const findAccessibilityLevel = (baseHex, contentHex) => {
  const comparison = createAccessibilityComparison(baseHex, contentHex);

  switch (true) {
    case comparison("AAA"):
      return "AAA";
    case comparison("AA"):
      return "AA-";
    default:
      return "---";
  }
};

const Icons = () => (
  <div>
    <IconList>
      {[faCheckCircle, faCalendarAlt, faCommentDots, faStar, faTrashAlt].map((icon, index) => (
        <li key={index}>
          <FontAwesomeIcon {...{ icon }} />
        </li>
      ))}
    </IconList>
  </div>
);

const Dividers = () => (
  <div>
    <DividerList>
      {[1, 2, 4].map(height => (
        <li key={height}>
          <Divider {...{ height }} />
        </li>
      ))}
    </DividerList>
  </div>
);

const Level = ({ children: level }) => {
  const characters = level
    .split("")
    .map((char, index) => <Character key={index}>{char}</Character>);

  return <span>{characters}</span>;
};

const ResultIcon = styled(FontAwesomeIcon)`
  transform: scale(${SCALE_600});
`;

const Results = ({ baseHex, contentHex }) => {
  const level = findAccessibilityLevel(baseHex, contentHex);
  const icon = level.includes("AA") ? faCheck : faTimes;
  const percentage = createContrastPercentage(baseHex, contentHex);

  return (
    <div>
      <ResultList>
        <ResultIcon {...{ icon }} size="1x" />
        <Level>{level}</Level>
        <span>{percentage}%</span>
      </ResultList>
    </div>
  );
};

export const UserComposition = memo(({ idComp, baseHex, contentHex }) => {
  return (
    <UserItem>
      <Examples {...{ baseHex, contentHex }}>
        <SmallText>The quick brown fox,</SmallText>
        <SmallText isBold>jumps over the lazy dog.</SmallText>
        <Icons />
        <Dividers />
      </Examples>
      <Results {...{ baseHex, contentHex }} />
    </UserItem>
  );
});

export const AppendComposition = memo(props => {
  return (
    // <li>
    <AppendSwatch {...props} />
    // </li>
  );
});
