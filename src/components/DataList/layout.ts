/** The viewport width from which a data-list row fits on one line: measured
 *  validators 1185, assets 1190, transactions 1204, one number so the lists
 *  cannot change shape within 70px of each other. */
export const ROW_LAYOUT_MIN_WIDTH = 1240;

/** `max-width: N` and `min-width: N` both match at exactly N, and the row
 *  layout owns N. */
export const belowWidth = (width: number): string => `${width - 0.02}px`;
