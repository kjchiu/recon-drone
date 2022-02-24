import { URL } from "url";
import fetch, { RequestInit} from "node-fetch";
import { Card, CardType, Faction} from "../Card";
import CardSource  from "./CardSource";
import { Buffer } from "buffer";

type JnetCardType =
    "Identity"
    | "Event"
    | "Program"
    | "Hardware"
    | "Resource"
    | "Agenda"
    | "Operation"
    | "ICE"
    | "Asset"
    | "Upgrade";

type JnetFaction = 
    "Anarch"
    | "Shaper"
    | "Criminal"
    | "Adam"
    | "Apex"
    | "Sunny"
    | "NBN"
    | "Haas-Bioroid"
    | "Weyland-Consortium"
    | "Jinteki";


type JnetCard = {
    title: string;
    text: string;
    type: JnetCardType;
    faction: JnetFaction;
};

const CARD_TYPE_BY_JNET_CARD_TYPE: Record<JnetCardType,CardType> = {
    Identity: CardType.IDENTITY,
    Event: CardType.EVENT,
    Hardware: CardType.HARDWARE,
    Program: CardType.PROGRAM,
    Resource: CardType.RESOURCE,
    Agenda: CardType.AGENDA,
    Operation: CardType.OPERATION,
    ICE: CardType.ICE,
    Asset: CardType.ASSET,
    Upgrade: CardType.UPGRADE,
}

const FACTION_BY_JNET_FACTION: Record<JnetFaction, Faction> = {
    "Anarch": Faction.ANARCH,
    "Shaper": Faction.SHAPER,
    "Criminal": Faction.CRIMINAL,
    "Adam": Faction.ADAM,
    "Apex": Faction.APEX,
    "Sunny": Faction.SUNNY,
    "NBN": Faction.NBN,
    "Haas-Bioroid": Faction.HB,
    "Weyland-Consortium": Faction.WEYLAND,
    "Jinteki": Faction.JINTEKI,
};

export default class Jnet implements CardSource {
    private url : string;
    private auth?: { user: string, password: string};

    constructor(url: string, auth?: {
        user: string,
        password: string,
    }) {
        this.url = url;
        this.auth = auth;
    }

    private deserialize(serialized: JnetCard): Card {
        return {
            name: serialized.title,
            text: serialized.text,
            type: CARD_TYPE_BY_JNET_CARD_TYPE[serialized.type],
            faction: FACTION_BY_JNET_FACTION[serialized.faction],
        }
    }

    async load(): Promise<Map<string, Card>> {
        const url = new URL('/data/cards', this.url);
        const options: RequestInit = {};
        if (this.auth) {
            options.headers = {
                Authorization: "Basic " + Buffer.from(`${this.auth.user}:${this.auth.password}`, "binary").toString("base64")
            }
        }
        const response = await fetch(url, options).then(x => x.json());
        if (Array.isArray(response)) {
            return new Map<string, Card>(response.map(serialized => {
                const card = this.deserialize(serialized as JnetCard);
                return [card.name, card];
            }));
        } else {
            console.error("failed to load cards, expected card array but received", typeof response);
            console.log(response)
            return new Map();
        }
    }
}