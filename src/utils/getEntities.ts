import { RecognizerResult } from "botbuilder"

export const extractEntities = (result: RecognizerResult): {} => {
  const results = {}
  const entites = result.entities
  const instance = entites.$instance
  for (const value of Object.values(instance)) {
    const tmp = value[0]
    if (tmp.score >= 0.5) {
      results[tmp.type] = tmp.text
    }
  }
  return results
}
