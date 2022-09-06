import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Letter } from "app/core/components/Letter"
import { Text } from "app/core/components/Text"
import { LetterGrid, GameGrid, GridArea } from "app/core/layouts/Grids"
import Layout from "app/core/layouts/Layout"
import { useCallback, useEffect, useState } from "react"
import Guess, { GuessResult } from "app/mutations/guess"
import StartNewGame from "app/mutations/startNewGame"
import CheckWord from "app/mutations/checkWord"
import { getSession, Session, SessionContext } from "@blitzjs/auth"
import { GetServerSideProps } from "next"
import { getTodayString } from "app/core/util"
import { useRouter } from "next/router"

const GUESS_ARRAY = new Array(6).fill({
  letter: "",
  state: 0,
})

interface HomeProps {
  session: SessionContext["$publicData"]
  currentDate: string
}

const Home: BlitzPage<HomeProps> = ({ session, currentDate }) => {
  const router = useRouter()
  const [guessTheWord] = useMutation(Guess)
  const [startNewGame] = useMutation(StartNewGame)
  const [checkWord] = useMutation(CheckWord)
  const [currentGuess, setCurrentGuess] = useState(0)
  const [currentWord, setCurrentWord] = useState<GuessResult>([])
  const [guessList, setGuessList] = useState<GuessResult[]>([])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    startNewGame()
      .then(async () => {
        await router.replace(router.asPath)
      })
      .catch()
  }, [])

  useEffect(() => {
    const { GameData } = session
    if (GameData?.Current) {
      setGuessList(GameData.Current.result)
      setCurrentGuess(GameData.Current.result.length)
    }
  }, [])

  const addGuess = useCallback(async (guess: GuessResult) => {
    if (guess.length < 5) {
      return
    }
    const word = guess.map((e) => e.letter).join("")

    const result = await checkWord(word)
    if (!result) {
      alert("Please put a sensible word")
      return
    }

    await guessTheWord(word)
      .then((result) => {
        // @ts-ignore
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti({
          emojis: ["💩", "🍆", "✨"],
          emojiSize: 50,
          confettiNumber: 80,
        })
        setGuessList((prev) => [...prev, result as unknown as GuessResult])
        setCurrentWord([])
        setCurrentGuess((prev) => prev + 1)
      })
      .catch(console.log)
  }, [])

  const keyPress = (event: KeyboardEvent) => {
    setCurrentWord((word) => {
      if (event.key === "Backspace") {
        return word.slice(0, word.length - 1)
      }
      if (event.key === "Enter") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        addGuess(word)
        return word
      }
      if (word.length > 4 || event.key.length > 1) return word
      /**
       * I dont give a f of deprecated methods
       */
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        return [
          ...word,
          {
            letter: event.key.toUpperCase(),
            state: 0,
          },
        ]
      }
      return word
    })
  }

  useEffect(() => {
    const body = document.querySelector("body")

    body?.addEventListener("keydown", keyPress)

    return () => {
      body?.removeEventListener("keydown", keyPress)
    }
  }, [])

  return (
    <Layout>
      <GameGrid>
        <GridArea css={{ display: "flex", justifyContent: "center" }}>
          <Text css={{ color: "white", fontSize: 48 }}>Shitty Wordle</Text>
        </GridArea>
        <LetterGrid>
          {GUESS_ARRAY.map((_, guessIndex) => {
            const isCurrent = guessIndex === currentGuess
            const word = isCurrent ? currentWord : guessList[guessIndex]

            return new Array(5).fill("").map((_, index) => {
              return (
                <Letter
                  isCurrent={isCurrent}
                  letter={word?.[index]?.letter ?? ""}
                  // @ts-ignore
                  state={word?.[index]?.state ?? 0}
                  key={index}
                />
              )
            })
          })}
        </LetterGrid>
        <GridArea css={{ justifyContent: "flex-end" }}>
          <Text css={{ color: "white", fontSize: 36 }}>{currentGuess + 1}/6</Text>
        </GridArea>
      </GameGrid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req, res }) => {
  const session = await getSession(req, res)
  const currentDate = getTodayString()

  return {
    props: {
      session: session.$publicData,
      currentDate,
    },
  }
}

export default Home
