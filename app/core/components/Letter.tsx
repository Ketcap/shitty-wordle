import { styled } from "./stitches"

const StyledLettter = styled("div", {
  width: 100,
  height: 100,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "30px",
  fontSize: "48px",
  textTransform: "uppercase",
  fontFamily: "Nunito",
  fontWeight: 800,
  variants: {
    state: {
      0: {
        background: "linear-gradient(135deg, #2D3047 0%, #48495F 100%)",
        color: "#A3A3AE",
      },
      1: {
        background: "linear-gradient(135deg, #D9B952 0%, #FDD85D 100%)",
        color: "#837035",
      },
      2: {
        background: "linear-gradient(135deg, #189D7C 0%, #02C39A 100%);",
        color: "#1D6B55",
      },
    },
  },
})

interface LetterProps {
  state: Parameters<typeof StyledLettter>[0]["state"]
  letter: string
}

export const Letter = ({ state, letter }: LetterProps) => {
  return <StyledLettter state={state}>{letter}</StyledLettter>
}
