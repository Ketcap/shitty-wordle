import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CheckWord = z.string().min(5);

export default resolver.pipe(
  resolver.zod(CheckWord),
  async (input) => {
    try {
      const result = await fetch(`
      https://api.dictionaryapi.dev/api/v2/entries/en/${input}
    `)
      return result.status === 200
    } catch {
      return false
    }
  })
