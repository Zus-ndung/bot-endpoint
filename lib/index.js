"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
const path = require("path");
const dotenv_1 = require("dotenv");
const ENV_FILE = path.join(__dirname, "..", ".env");
dotenv_1.config({ path: ENV_FILE });
const express = require("express");
const bodyParser = require("body-parser");
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const botbuilder_1 = require("botbuilder");
const botbuilder_ai_1 = require("botbuilder-ai");
// This bot's main dialog.
const Bot_1 = require("./services/bot/Bot");
// Create HTTP server.
const server = express();
server.use(bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log("\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator");
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});
const credentialsFactory = new botbuilder_1.ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: "44c477b3-010b-4f0d-a6ac-cfd0fa706447",
    MicrosoftAppPassword: process.env.MicrosoftAppPassword || "75e079f3-cea6-4e78-bbed-ff56b7dd1231",
    MicrosoftAppType: "SingleTenant",
    MicrosoftAppTenantId: "06f1b89f-07e8-464f-b408-ec1b45703f31",
});
console.log(credentialsFactory);
const botFrameworkAuthentication = botbuilder_1.createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);
// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
// Catch-all for errors.
const onTurnErrorHandler = (context, error) => __awaiter(void 0, void 0, void 0, function* () {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.log(error);
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    yield context.sendTraceActivity("OnTurnError Trace", `${error}`, "https://www.botframework.com/schemas/error", "TurnError");
    // Send a message to the user
    yield context.sendActivity("The bot encountered an error or bug.");
    yield context.sendActivity("To continue to run this bot, please fix the bot source code.");
});
// Set the onTurnError for the singleton CloudAdapter.
adapter.onTurnError = onTurnErrorHandler;
const luis = new botbuilder_ai_1.LuisRecognizer({
    applicationId: "b0c88275-05c6-410f-9f1c-5985ff609a52",
    endpoint: "https://myluistestvua-authoring.cognitiveservices.azure.com/",
    endpointKey: "4c783bbcb43e4200b27a94faa2b53641",
});
// Create the main dialog.
const myBot = new Bot_1.MyBot(luis);
// Listen for incoming requests.
server.post("/api/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Route received a request to adapter for processing
    yield adapter.process(req, res, (context) => myBot.run(context));
}));
// Listen for Upgrade requests for Streaming.
server.on("upgrade", (req, socket, head) => __awaiter(void 0, void 0, void 0, function* () {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new botbuilder_1.CloudAdapter(botFrameworkAuthentication);
    // Set onTurnError for the CloudAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;
    yield streamingAdapter.process(req, socket, head, (context) => myBot.run(context));
}));
//# sourceMappingURL=index.js.map