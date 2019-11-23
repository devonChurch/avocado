import { css, keyframes } from "styled-components";
import tinyColor from "tinycolor2";
import qs from "qs";

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
export const COMP_HEIGHT = SPACE_500 * 18;

export const BORDER_RADIUS = 4;

export const WHITE = "#fff";
export const BLACK = "#000";

export const GRAY_100 = "#EAF0EE";
export const GRAY_300 = "#c8d5d1";
export const GRAY_500 = "#8DA79F";
export const GRAY_700 = "#5c716b";
export const GRAY_900 = "#40504C";

export const SPEED_500 = 250;
export const SPEED_700 = 500;

export const SCALE_200 = 0.5;
export const SCALE_300 = 0.8;
export const SCALE_400 = 0.9;
export const SCALE_500 = 1;
export const SCALE_600 = 1.1;

export const FOCUS_SHADOW_500 = `0 0 13px ${FOCUS_WIDTH}px ${createSwatch(BLACK).setAlpha(0.25)}`;

export const LUMINANCE_SHADOW_500 = `inset 0 0 0 ${BORDER_WIDTH}px ${createSwatch(BLACK).setAlpha(
  0.1
)}`;

export const findColorComplementFromSwatches = (compareId, swatches) => {
  const compareHex = swatches.get(compareId);
  const hexes = [...swatches.values()];
  const complementHex = tinyColor.mostReadable(compareHex, hexes).toHexString();
  const [complementId] = [...swatches.entries()].find(([, hex]) => hex === complementHex);

  return complementId;
};

export const checkHasLowLuminance = hex => createSwatch(hex).getLuminance() > 0.9;

const updateLuminanceStatic = (lighten, darken) => (isLuminant, luminance) =>
  isLuminant ? lighten : darken;

const updateLuminanceDynamic = percentage => (isLuminant, luminance) => {
  const offset = (luminance * percentage) / 100;
  return isLuminant ? Math.max(luminance - offset, 0) : Math.min(luminance + offset, 100);
};

const createColorCompanion = (createUpdate, alpha = 1) => hex => {
  const prevSwatch = createSwatch(hex).toHsl();
  const { l: luminanceBefore } = prevSwatch;
  const isLuminant = luminanceBefore > 0.6;
  const luminanceAfter = createUpdate(isLuminant, luminanceBefore);
  const nextSwatch = { ...prevSwatch, l: luminanceAfter };

  return tinyColor(nextSwatch)
    .setAlpha(alpha)
    .toString();
};

export const createOffsetColor = createColorCompanion(updateLuminanceStatic(0.2, 0.8));
export const createTargetColor = hex => hex;
export const createFocusColor = createColorCompanion(updateLuminanceStatic(0.3, 0.7), 0.5);
export const createActiveColor = createColorCompanion(updateLuminanceStatic(0.5, 0.5), 1);

export const createFocusborder = hex => `0 0 0 ${FOCUS_WIDTH}px ${createFocusColor(hex)}`;
export const createFocusState = hex => createFocusborder(hex);
export const createFocusStateWithShadow = hex => `${FOCUS_SHADOW_500}, ${createFocusborder(hex)}`;

export const resetList = css`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const positionAbsolute = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const defaultSwatches = new Map([
  // Green.
  ["1", createSwatch("#E1FAF3").toHexString()],
  ["2", createSwatch("#b2fbe4").toHexString()],
  ["3", createSwatch("#00ffb8").toHexString()],
  ["4", createSwatch("#119f72").toHexString()],
  ["5", createSwatch("#1E4C3F").toHexString()],
  // Gray.
  ["6", createSwatch("#EAF0EE").toHexString()],
  ["7", createSwatch("#b4c5c0").toHexString()],
  ["8", createSwatch("#8DA79F").toHexString()],
  ["9", createSwatch("#5c716b").toHexString()],
  ["10", createSwatch("#40504C").toHexString()]
]);

const defaultCompositions = new Map([
  ["1", { baseId: "5", contentId: "3" }],
  ["2", { baseId: "3", contentId: "5" }],
  ["3", { baseId: "2", contentId: "5" }],
  ["4", { baseId: "10", contentId: "2" }],
  ["5", { baseId: "6", contentId: "9" }]
]);

export const convertStateToQuery = (swatches, compositions) => {
  const swatchFlat = [...swatches.values()];
  const swatchKeys = [...swatches.keys()];
  const compFlat = [...compositions.values()].map(({ baseId, contentId }) => [
    swatchKeys.indexOf(baseId),
    swatchKeys.indexOf(contentId)
  ]);

  return qs.stringify({ s: swatchFlat, c: compFlat }, { addQueryPrefix: true });
};

export const convertStateFromQuery = search => {
  const { s: swatches = [], c: compositions = [] } = qs.parse(search, { ignoreQueryPrefix: true });
  const swatchMap = new Map(swatches.map((value, index) => [`${index}`, value]));
  const compMap = new Map(
    compositions.map(([baseId, contentId], index) => [`${index}`, { baseId, contentId }])
  );
  const hasUserConfig = swatchMap.size || compMap.size;

  return {
    swatches: hasUserConfig ? swatchMap || [] : defaultSwatches,
    compositions: hasUserConfig ? compMap || [] : defaultCompositions
  };
};

export const deleteKeyframes = offset => keyframes`
  from {
    transform: rotate(-${offset}deg);
  }

  to {
    transform: rotate(${offset}deg);
  }
`;

export const deleteAnimation = offset => css`
  transform-origin: right top;
  animation: 0.1s infinite alternate ${deleteKeyframes(offset)};
  animation-timing-function: ease-in-out;
`;
