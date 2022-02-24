import { ColorResolvable, InteractionReplyOptions, MessageEmbed, MessageEmbedOptions, MessageOptions } from "discord.js";
import { Card, CardType, Faction } from "./Card";
import Cards from "./Cards";


const FACTION_COLOURS: Record<Faction, ColorResolvable> = {
	[ Faction.ANARCH]: "#ff4500",
	[ Faction.CRIMINAL ]: "#4169e1",
	[ Faction.SHAPER ]: "#32cd32",
	[ Faction.ADAM ]: "#9a8f45",
	[ Faction.SUNNY ]: "#907193",
	[ Faction.APEX ]: "#671412",
	[ Faction.JINTEKI ]: "#ed143d",
	[ Faction.WEYLAND ]: "#006400",
	[ Faction.HB ]: "#8a2be2",
	[ Faction.NBN ]: "#ff8c00",
	[ Faction.NEUTRAL ]: "#808080",
};

export default function formatter(card: Card): {embeds: MessageEmbed[]} {

    const embed = new MessageEmbed().setTitle(card.name)
            .setColor(FACTION_COLOURS[card.faction])
            .setDescription(card.text);

    return {
        embeds: [
            embed
        ]
    }
}

