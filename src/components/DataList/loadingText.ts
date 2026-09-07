import React from 'react';

/** Occupies a text line without painting one, so each slot keeps the exact
 *  line box its value will have, at every root font size and in every locale. */
export const HOLD_LINE = '\u200b';

/** Puts a Skeleton on the text baseline of the slot it stands in for. */
export const SKELETON_INLINE: React.CSSProperties = {
  display: 'inline-block',
  verticalAlign: 'middle',
};
