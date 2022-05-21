import { ActivityHandler, MessageFactory } from "botbuilder"
import { LuisRecognizer } from "botbuilder-ai"
import { extractEntities } from "../../utils/getEntities"
import { Message } from "../messages"
import Sparql from "../sparql/index"

export class MyBot extends ActivityHandler {
  private _luis: LuisRecognizer
  private _sparql: Sparql
  private _message: Message

  constructor(luis: LuisRecognizer) {
    super()
    this._luis = luis
    this._sparql = new Sparql()
    this._message = new Message()

    this.onMessage(async (context, next) => {
      const replyText = `Echo: ${context.activity.text}`
      await this._luis.recognize(context).then(async (res) => {
        const top = LuisRecognizer.topIntent(res)
        const entityName = extractEntities(res)
        if (!entityName) {
          await context.sendActivity(
            MessageFactory.text("I don't understand subject")
          )
        } else {
          //print
          const gen = [
            "intent " + top,
            "name " + entityName["name"],
            "relationship " + entityName["relationship"],
          ]
          await context.sendActivities(
            gen.map((text) => MessageFactory.text(text))
          )
          //

          const x = await this._sparql.extractSubject(entityName["name"])
          let subject
          if (x["subject"].length > 0) {
            subject = x["subject"][0]
            entityName["subject"] = subject
          }
          if (subject) {
            const res = await this._sparql.queryOntology(top, entityName)
            const rTexts = this._message.genMessage(res)

            await context.sendActivities(
              rTexts.map((text) => MessageFactory.text(text))
            )
          } else {
            await context.sendActivity(
              MessageFactory.text("I don't understand subject")
            )
          }
        }
      })
      await next()
    })

    //first Message
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded
      const welcomeText = [
        "Hi, I'm Friday bot developed by Dung",
        "I can help you query information about Vietnam's history",
      ]
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivities(
            welcomeText.map((message) => MessageFactory.text(message))
          )
        }
      }
      await next()
    })
  }
}
