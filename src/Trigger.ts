import { CacheType, CommandInteractionOptionResolver, InteractionReplyOptions, Message, MessageEmbed, MessageOptions, MessagePayload  } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders";

export type TriggerResponse = string | { embeds: MessageEmbed[]}
export type Worker<T> = (args: T) => Promise<TriggerResponse>;

type BaseInteraction<T extends {}> = {
    name: string;
    type: "command" | "message";
    worker: Worker<T>;
}

export type MessageTrigger<T extends {}> = BaseInteraction<T> & {
    type: "message";
    parse: (msg:Message) => T | undefined
}

export type CommandTrigger<T extends {}> = BaseInteraction<T> & {
    type: "command";
    build: () => Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    parse: (options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => T;
}


export type Trigger<T> = MessageTrigger<T> | CommandTrigger<T>