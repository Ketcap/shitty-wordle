import { styled } from "../components/stitches"

export const LetterGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(5,1fr)",
  gridTemplateRows: "1fr",
  gap: "10px",
  rowGap: "30px",
})

export const GameGrid = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: 50,
})

export const GridArea = styled("div", {
  display: "flex",
})
