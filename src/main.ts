import { SlashCommandBuilder } from "@discordjs/builders";

import Jnet from "./sources/Jnet";
import Cards from "./Cards";
import bot from "./Bot";
import { CommandTrigger, Trigger, TriggerResponse } from "./Trigger";
import { Message, MessageEmbed, MessagePayload } from "discord.js";

import config from "./config.json";
import { Card } from "./Card";
import formatter from "./formatter";

console.log("hello");

(async () => {

    const sources: Jnet[] = config.sources.filter(s => s && s.type === "jnet").map(source => {
            const {
                url,
                auth,
            } = source;
            return new Jnet(url, auth);
    });
    const cards = new Cards(sources);

    const findCardByName = async (args: { query: string}): Promise<Card|undefined> => {
            const { query } = args;
            return cards.findByName(query);
    }

    async function findCardByNameWorker(args: { query }): Promise<TriggerResponse> {
            const card = await findCardByName(args);
            if (! card) {
                return "Could not find card";
            } else {
                return formatter(card);
            }
    }

    await cards.load();
    await bot([{
        name: "card",
        build: () => new SlashCommandBuilder()
            .setName("card")
            .setDescription("Find card by name")
            .addStringOption(option => option.setName("query").setDescription("query").setRequired(true)),
        type: "command",
        parse: (options) => {
            return {
                query: options.getString("query", true),
            };
        },
        worker: findCardByNameWorker,

    }], [{
        name: "card name [[]]",
        type: "message",
        parse: (msg:Message) => {
            const regex = /\[\[([^\[\]]*)\]\]/g;
            const matches = regex.exec(msg.content);
            if (! matches) {
                return null;
            }
            return {
                query: matches[1],
            };
        },
        worker: findCardByNameWorker,
    }]);
})();