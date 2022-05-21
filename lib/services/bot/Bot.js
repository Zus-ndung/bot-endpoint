"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyBot = void 0;
const botbuilder_1 = require("botbuilder");
const botbuilder_ai_1 = require("botbuilder-ai");
const getEntities_1 = require("../../utils/getEntities");
const messages_1 = require("../messages");
const index_1 = require("../sparql/index");
class MyBot extends botbuilder_1.ActivityHandler {
    constructor(luis) {
        super();
        this._luis = luis;
        this._sparql = new index_1.default();
        this._message = new messages_1.Message();
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            const replyText = `Echo: ${context.activity.text}`;
            yield this._luis.recognize(context).then((res) => __awaiter(this, void 0, void 0, function* () {
                const top = botbuilder_ai_1.LuisRecognizer.topIntent(res);
                const entityName = getEntities_1.extractEntities(res);
                if (!entityName) {
                    yield context.sendActivity(botbuilder_1.MessageFactory.text("I don't understand subject"));
                }
                else {
                    //print
                    const gen = [
                        "intent " + top,
                        "name " + entityName["name"],
                        "relationship " + entityName["relationship"],
                    ];
                    yield context.sendActivities(gen.map((text) => botbuilder_1.MessageFactory.text(text)));
                    //
                    const x = yield this._sparql.extractSubject(entityName["name"]);
                    let subject;
                    if (x["subject"].length > 0) {
                        subject = x["subject"][0];
                        entityName["subject"] = subject;
                    }
                    if (subject) {
                        const res = yield this._sparql.queryOntology(top, entityName);
                        const rTexts = this._message.genMessage(res);
                        yield context.sendActivities(rTexts.map((text) => botbuilder_1.MessageFactory.text(text)));
                    }
                    else {
                        yield context.sendActivity(botbuilder_1.MessageFactory.text("I don't understand subject"));
                    }
                }
            }));
            yield next();
        }));
        //first Message
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = [
                "Hi, I'm Friday bot developed by Dung",
                "I can help you query information about Vietnam's history",
            ];
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    yield context.sendActivities(welcomeText.map((message) => botbuilder_1.MessageFactory.text(message)));
                }
            }
            yield next();
        }));
    }
}
exports.MyBot = MyBot;
//# sourceMappingURL=Bot.js.map