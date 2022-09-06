import { resolver } from "@blitzjs/rpc"
import { getTodayString } from "app/core/util";
import { GameHistory } from "types";


export default resolver.pipe(async (_, ctx) => {
  const { $publicData: session } = ctx.session;

  const currentDate = getTodayString();

  if (session.GameData?.Current.date !== currentDate) {
    const currentGame = session.GameData?.Current;
    const history = [
      ...session.GameData?.History ?? [],
      currentGame as GameHistory
    ]
    await ctx.session.$setPublicData({
      GameData: {
        Current: {
          date: currentDate,
          result: []
        },
        History: history
      },
    })
  }
})
