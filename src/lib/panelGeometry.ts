/**
 * Shared "mid-point along the edge" math.
 *
 * The panel is a band of a given size centered somewhere along the stuck
 * edge, controlled by an offset fraction (0 = start of edge, 0.5 = center,
 * 1 = end of edge). For a left/right blade this band runs along the screen
 * HEIGHT (verticalOffset); for a top/bottom bar it runs along the screen
 * WIDTH (horizontalOffset). Both axes use the exact same formula, so this
 * helper replaces four independent copies of it (Panel.tsx,
 * CopyIndicatorCurve.tsx, PreviewFlyout.tsx, IndicatorStyleFlyout.tsx).
 */
export interface PanelBand {
  /** Pixel size of the band along the edge. */
  size: number
  /** Pixel mid-point of the band along the edge. */
  mid: number
  /** Pixel start (top/left) of the band along the edge. */
  start: number
}

export function computePanelBand(screenSize: number, offsetFrac: number, sizeFrac: number): PanelBand {
  const size = screenSize * sizeFrac
  const min = size / 2
  const max = screenSize - size / 2
  const mid = Math.round(min + offsetFrac * (max - min))
  return { size, mid, start: mid - size / 2 }
}
