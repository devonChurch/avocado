import React, { memo, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faTasks } from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import {
  BLACK,
  GRAY_300,
  GRAY_900,
  COMP_WIDTH,
  COMP_HEIGHT,
  BORDER_RADIUS,
  BORDER_WIDTH,
  SCALE_200,
  SCALE_300,
  SCALE_500,
  SCALE_600,
  SPACE_400,
  SPACE_500,
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
import { AddButton } from "./Swatch";

const Button = styled(AddButton)`
  display: inline-flex;
  align-items: center;
  width: auto;
  padding: 0 ${SPACE_500}px;
  text-decoration: none;

  > *:nth-child(1n + 2) {
    margin-left: ${SPACE_400}px;
  }
`;

const ButtonHeader = styled.header`
  height: ${SPACE_800}px;
  display: flex;
  justify-content: space-between;
`;

export const Header = memo(({ isDeleting, handleDeleteToggle }) => (
  <ButtonHeader>
    <Button hex={GRAY_300} as="a" href="https://github.com/devonChurch/avocado">
      <FontAwesomeIcon icon={faGithubAlt} size="1x" />
      <span>Github</span>
    </Button>
    <Button hex={GRAY_300} onClick={handleDeleteToggle}>
      <FontAwesomeIcon icon={isDeleting ? faTasks : faTrashAlt} size="1x" />
      <span>{isDeleting ? "Edit" : "Delete"}</span>
    </Button>
  </ButtonHeader>
));
