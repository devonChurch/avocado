import { css } from "styled-components";
import tinyColor from "tinycolor2";

export const createSwatch = hex => tinyColor(hex);

export const SPACE_300 = 4;
export const SPACE_400 = 8;
export const SPACE_500 = 16;
export const SPACE_600 = 24;
export const SPACE_700 = 32;
export const SPACE_800 = 40;

export const SWATCH_WIDTH = 80;
export const BORDER_WIDTH = 3;
export const FOCUS_WIDTH = 3;
export const COMP_WIDTH = SPACE_500 * 16;

export const BORDER_RADUIS = 4;

export const WHITE = "#fff";
export const BLACK = "#000000";

export const GRAY_100 = "#EAF0EE";
export const GRAY_300 = "#c8d5d1";
export const GRAY_500 = "#8DA79F";
export const GRAY_700 = "#5c716b";
export const GRAY_900 = "#40504C";

export const SPEED_500 = "250ms";
export const SPEED_700 = "500ms";

export const SCALE_300 = 0.8;
export const SCALE_400 = 0.9;
export const SCALE_500 = 1;
export const SCALE_600 = 1.1;

export const { 0: FOCUS_SHADOW_0, 500: FOCUS_SHADOW_500 } = (() => {
  const swatch = createSwatch("#000");

  return {
    0: `0 0 0 ${FOCUS_WIDTH}px ${swatch.setAlpha(0.15)}`,
    500: `0 0 13px ${FOCUS_WIDTH}px ${swatch.setAlpha(0.25)}`
  };
})();

const createFocusColor = hex => {
  const swatch = createSwatch(hex);
  const isLight = swatch.isLight();
  const modifier = isLight ? "darken" : "lighten";
  const strength = isLight ? 10 : 30;

  return swatch[modifier](strength).toString();
};

export const createFocusborder = hex => `0 0 0 ${FOCUS_WIDTH}px ${createFocusColor(hex)}`;
export const createFocusState = hex => createFocusborder(hex);
export const createFocusStateWithShadow = hex => `${FOCUS_SHADOW_500}, ${createFocusborder(hex)}`;

export const resetList = css`
  list-style: none;
  margin: 0;
  padding: 0;
`;
