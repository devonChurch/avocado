import React, { memo, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled, { css } from "styled-components";
import tinyColor from "tinycolor2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faCheckCircle,
  faCalendarAlt,
  faCommentDots,
  faStar,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  GRAY_300,
  GRAY_900,
  COMP_HEIGHT_LARGE,
  COMP_WIDTH_LARGE,
  COMP_HEIGHT_SMALL,
  COMP_WIDTH_SMALL,
  BORDER_RADIUS,
  SCALE_200,
  SCALE_300,
  SCALE_500,
  SCALE_600,
  SPACE_500,
  SPACE_600,
  SPEED_500,
  SPEED_700,
  VIEWPORT_500,
  LUMINANCE_SHADOW_500,
  checkHasLowLuminance,
  resetList,
  positionAbsolute,
  deleteAnimation,
} from "./utils";
import { AddItem, AddButton, DeleteButton } from "./Swatch";

const CompList = styled.ul`
  ${resetList}
  display: grid;
  grid-gap: ${SPACE_500}px;
  grid-template-columns: repeat(auto-fit, minmax(${COMP_WIDTH_LARGE}px, auto));
  /* grid-template-rows: repeat(auto-fill, minmax(${COMP_HEIGHT_LARGE}px, auto)); */

  @media screen and (min-width: ${VIEWPORT_500}px) {
    grid-gap: ${SPACE_600}px;
  }

  > * {
    min-height: ${COMP_HEIGHT_SMALL}px;
    min-width: ${COMP_WIDTH_SMALL}px;

    @media screen and (min-width: ${VIEWPORT_500}px) {
      min-height: ${COMP_HEIGHT_LARGE}px;
      min-width: ${COMP_WIDTH_LARGE}px;
    }
  }
`;

const IconList = styled.ul`
  ${resetList}

  display: grid;
  grid-template-columns: repeat(auto-fit, 1rem);
  grid-gap: ${SPACE_500}px;

  @media screen and (min-width: ${VIEWPORT_500}px) {
    grid-gap: ${SPACE_600}px;
  }
`;

const DividerList = styled.ul`
  ${resetList}
  display: grid;
  grid-gap: ${SPACE_500}px;
  grid-template-columns: 1fr;

  @media screen and (min-width: ${VIEWPORT_500}px) {
    grid-gap: ${SPACE_600}px;
  }
`;

const ResultList = styled.ul`
  ${resetList}
  display: flex;
  border-radius: 0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px;
  background: ${GRAY_300};
  color: ${GRAY_900};
  justify-content: space-between;
  padding: ${SPACE_500}px;
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  align-items: center;

  @media screen and (min-width: ${VIEWPORT_500}px) {
    padding: ${SPACE_600}px;
  }

  > * {
    display: block;
  }
`;

const Character = styled.span`
  opacity: ${({ children }) => (children === "A" ? 1 : 0.25)};
`;

const UserItem = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  transition-property: opacity, transform;
  transition-duration: ${SPEED_500}ms;
  transform: scale(SCALE_500);

  ${({ isUserDragging }) =>
    isUserDragging &&
    css`
      opacity: 0.5;
      pointer-events: none;
      /* transform: scale(${SCALE_300}); */
    `}

  ${({ isDeleting, hasCapacityToDelete }) =>
    isDeleting && hasCapacityToDelete && deleteAnimation(0.5)}
`;

const Examples = styled.div`
  /**
   * Targeting the "Base" and "Content" hex values via CSS variables as the
   * performance is more optimal than re-rendering a baked in value on every change.
   *
   * It also fixes an issue when referencing currentColor within a linear
   * gradient (inconsistent in browsers).
   */
  --baseHex: ${({ baseHex }) => baseHex};
  --contentHex: ${({ contentHex }) => contentHex};

  border-radius: ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: ${SPACE_500}px;
  background: var(--baseHex);
  color: var(--contentHex);
  padding: ${SPACE_500}px;
  position: relative;
  font-family: sans-serif;
  transition: background ${SPEED_700}ms;

  @media screen and (min-width: ${VIEWPORT_500}px) {
    padding: ${SPACE_600}px;
    grid-gap: ${SPACE_600}px;
  }

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

const Divider = styled.div`
  border-radius: ${BORDER_RADIUS}px;
  height: ${({ height }) => `${height}px`};
  background-image: linear-gradient(to right, var(--contentHex), var(--baseHex));
`;

export const Compositions = CompList;

const createContrastPercentage = (baseHex, contentHex) => {
  const ratio = tinyColor.readability(baseHex, contentHex);
  const percentage = (ratio / 21) * 100;

  return Math.round(percentage);
};

const createAccessibilityComparison = (baseHex, contentHex) => (level) =>
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
      {[1, 2, 4].map((height) => (
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

const DropAreas = styled.div`
  ${positionAbsolute}
  align-items: stretch;
  display: grid;
  grid-gap: ${SPACE_500}px;
  justify-items: stretch;
  padding: ${SPACE_600}px;
  transition-duration: ${SPEED_500}ms;
  transition-property: opacity, transform;

  ${({ isUserDragging }) =>
    !isUserDragging &&
    css`
      opacity: 0;
      pointer-events: none;
      transform: scale(${SCALE_600});
    `}

  @media screen and (min-width: ${VIEWPORT_500}px) {
    grid-gap: ${SPACE_600}px;
  }
`;

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

const ItemWrapper = styled.li`
  position: relative;
  transition-duration: ${SPEED_500}ms;
  transition-property: opacity, transform;

  /** React CSSTransition animation property when an item is in its DORMANT state. */
  &.composition-enter,
  &.composition-exit,
  &.composition-exit-active {
    opacity: 0;
    transform: scale(${SCALE_200});
  }

  /** React CSSTransition animation property when an item is in its ACTIVE state. */
  &.composition-enter-active,
  &.composition-enter-done {
    opacity: 1;
    transform: scale(${SCALE_500});
  }
`;

const AddCompositionButton = styled(AddButton)`
  ${({ isActive }) =>
    isActive
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;

const AddSlotButton = styled(AddButton)`
  /**
   * Hack for Safari, which does not confirm to positioning grid elements when
   * the wrapper element has an opacity of 0. In that regard we staticky set
   * the height of the slot 😩
   */
  min-height: 83px;

  @media screen and (min-width: ${VIEWPORT_500}px) {
    min-height: 115px;
  }
`;

export const UserComposition = memo(
  ({
    compId,
    baseId,
    contentId,
    dragStartId,
    baseHex,
    contentHex,
    dragHex,
    isUserDragging,
    isDeleting,
    hasCapacityToDelete,
    handleDelete,
    handleDrop,
    setActiveCompositionId,
    removeActiveCompositionId,
  }) => {
    const [isContentTargeted, setIsContentTargeted] = useState(false);
    const [isBaseTargeted, setIsBaseTargeted] = useState(false);

    return (
      <ItemWrapper>
        <UserItem
          {...{ isUserDragging, isDeleting, hasCapacityToDelete }}
          onPointerEnter={isDeleting ? undefined : () => setActiveCompositionId(compId)}
          onPointerLeave={isDeleting ? undefined : removeActiveCompositionId}
        >
          <Examples {...{ baseHex, contentHex }}>
            <SmallText>The quick brown fox,</SmallText>
            <SmallText isBold>jumps over the lazy dog.</SmallText>
            <Icons />
            <Dividers />
          </Examples>
          <Results {...{ baseHex, contentHex }} />
          <CSSTransition
            unmountOnExit
            in={isDeleting && hasCapacityToDelete}
            timeout={SPEED_700}
            classNames="deleteItem"
          >
            <DeleteButton hex={GRAY_300} onClick={() => handleDelete(compId)}>
              <FontAwesomeIcon icon={faTimes} size="1x" />
            </DeleteButton>
          </CSSTransition>
        </UserItem>
        <DropAreas {...{ isUserDragging }}>
          <AddSlotButton
            hex={isContentTargeted ? dragHex : contentHex}
            isTargeted={isContentTargeted}
            onDragOver={(event) => {
              setIsContentTargeted(true);
              event.preventDefault();
            }}
            onDragLeave={() => setIsContentTargeted(false)}
            onDrop={(event) => {
              handleDrop(compId, { contentId: dragStartId, baseId });
              setIsContentTargeted(false);
              setIsBaseTargeted(false);
              event.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </AddSlotButton>
          <AddSlotButton
            hex={isBaseTargeted ? dragHex : baseHex}
            isTargeted={isBaseTargeted}
            onDragOver={(event) => {
              setIsBaseTargeted(true);
              event.preventDefault();
            }}
            onDragLeave={() => setIsBaseTargeted(false)}
            onDrop={(event) => {
              handleDrop(compId, { contentId, baseId: dragStartId });
              setIsContentTargeted(false);
              setIsBaseTargeted(false);
              event.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </AddSlotButton>
        </DropAreas>
      </ItemWrapper>
    );
  }
);

export const AppendComposition = memo(
  ({ dragHex, dragStartId, handleClick, handleDrop, isUserDragging }) => {
    const [isAddTargeted, setIsAddTargeted] = useState(false);
    const [isContentTargeted, setIsContentTargeted] = useState(false);
    const [isBaseTargeted, setIsBaseTargeted] = useState(false);

    return (
      <AddItem>
        <DropAreas {...{ isUserDragging }}>
          <AddSlotButton
            hex={isContentTargeted ? dragHex : GRAY_300}
            isTargeted={isContentTargeted}
            onDragOver={(event) => {
              setIsContentTargeted(true);
              event.preventDefault();
            }}
            onDragLeave={() => setIsContentTargeted(false)}
            onDrop={(event) => {
              handleDrop({ contentId: dragStartId });
              setIsContentTargeted(false);
              event.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </AddSlotButton>
          <AddSlotButton
            hex={isBaseTargeted ? dragHex : GRAY_300}
            isTargeted={isBaseTargeted}
            onDragOver={(event) => {
              setIsBaseTargeted(true);
              event.preventDefault();
            }}
            onDragLeave={() => setIsBaseTargeted(false)}
            onDrop={(event) => {
              handleDrop({ baseId: dragStartId });
              setIsContentTargeted(false);
              setIsBaseTargeted(false);
              event.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faPlus} size="2x" />
          </AddSlotButton>
        </DropAreas>
        <AddCompositionButton
          hex={GRAY_300}
          isActive={!isUserDragging}
          isTargeted={isAddTargeted}
          onClick={handleClick}
          onPointerEnter={() => setIsAddTargeted(true)}
          onPointerLeave={() => setIsAddTargeted(false)}
        >
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </AddCompositionButton>
      </AddItem>
    );
  }
);
