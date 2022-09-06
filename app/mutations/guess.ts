import { resolver } from "@blitzjs/rpc";
import { getTodayString } from "app/core/util";
import db from "db";
import { GameData, GameHistory } from "types";
import { z } from "zod";

const GuessedWord = z.string().length(5)

export interface GuessOutput {
  letter: string;
  state: number;
}

export type GuessResult = GuessOutput[];

export default resolver.pipe(
  async (input, ctx) => {
    const currentDay = new Date(getTodayString());
    const dailyWord = await db.wordles.findFirst({
      where: {
        date: currentDay
      }
    })

    if (!dailyWord) {
      throw new Error("No word for today")
    }

    const { word: DAILY_WORD } = dailyWord;

    const guessedWord = GuessedWord.parse(input).toLowerCase();
    const response = DAILY_WORD.split('').reduce<GuessResult>((state, cur, index) => {
      let s = cur === guessedWord[index] ? 2 : 0;
      const currentLetterIndex = DAILY_WORD.indexOf(guessedWord[index] ?? '');
      if (currentLetterIndex > -1 && s === 0) {
        s = 1;
      }

      return [
        ...state,
        {
          letter: guessedWord?.[index] ?? '',
          state: s
        }
      ]
    }, [])

    const { $publicData: session } = ctx.session;
    const currentDate = getTodayString();
    const newHistory = (session?.GameData?.History ?? []).reduce<GameData['History']>((state, cur) => {
      if (cur?.date && cur.date === currentDate) {
        return [
          ...state,
          {
            date: currentDate,
            result: [
              ...cur.result,
              response
            ]
          }
        ]
      }

      return state;
    }, [])

    const currentGame = session?.GameData?.Current?.result ?? [];

    await ctx.session.$setPublicData({
      ...session,
      GameData: {
        Current: {
          date: currentDate!,
          result: [...currentGame, response]
        },
        History: newHistory
      }
    })

    return response;
  }
);
