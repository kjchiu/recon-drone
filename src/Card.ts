import { SystemChannelFlagsString } from "discord.js";

export enum DeckType {
    CORP,
    RUNNER
}

export enum Faction {
    NEUTRAL,

    HB,
    JINTEKI,
    NBN,
    WEYLAND,

    ANARCH,
    CRIMINAL,
    SHAPER,

    ADAM,
    SUNNY,
    APEX
}

export enum CardType {
    IDENTITY,

    EVENT,
    PROGRAM,
    HARDWARE,
    RESOURCE,

    AGENDA,
    OPERATION,
    ICE,
    ASSET,
    UPGRADE,
};

export type Card = {
    name: string;
    text: string;
    flavourText?: string;
    faction: Faction;
    artist?: string;
    type: CardType;
};
