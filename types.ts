import { Session } from "@blitzjs/auth"
import { getTodayString } from "app/core/util"
import { GuessResult } from "app/mutations/guess"

export interface GameHistory {
  date: string // "2021-01-28"
  result: GuessResult[]
}
export interface GameData {
  Current: GameHistory
  History: GameHistory[]
}

declare module "@blitzjs/auth" {
  export interface Session {
    PublicData: {
      GameData: GameData
    }
  }
}


export const defaultSession: Session['PublicData'] = {
  GameData: {
    Current: {
      date: getTodayString(),
      result: []
    },
    History: [],
  },
}