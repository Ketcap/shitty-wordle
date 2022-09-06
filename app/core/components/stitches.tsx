import { createStitches } from "@stitches/react"

export const { getCssText, styled, globalCss } = createStitches()

export const globalStyles = globalCss({
  body: { margin: 0, padding: 0, height: "100%", width: "100%" },
  html: { margin: 0, padding: 0, height: "100%", width: "100%" },
  "#__next": { height: "100%", width: "100%" },
})
