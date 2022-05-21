import { ActivityHandler } from "botbuilder";
import { LuisRecognizer } from "botbuilder-ai";
export declare class MyBot extends ActivityHandler {
    private _luis;
    private _sparql;
    private _message;
    constructor(luis: LuisRecognizer);
}
