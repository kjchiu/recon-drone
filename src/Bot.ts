import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client, Intents, Message, MessageEmbed, MessagePayload } from "discord.js";
import config from "./Config"
import Cards from "./Cards";
import { CommandTrigger, MessageTrigger } from "./Trigger";


// https://discord.com/oauth2/authorize?client_id=943287770279985222&permissions=277025458240&scope=bot%20applications.commands

export default async (commands: CommandTrigger<any>[], messageTriggers: MessageTrigger<any>[]):Promise<void> => {

    const commandsByName = commands.reduce((accum, command) => {
        accum.set(command.name, command);
        return accum;
    }, new Map<string, CommandTrigger<any>>());

    const APP_ID = "943287770279985222";
    const SERVER_ID = "272459782869221377";
    const rest = new REST({ version: '9' }).setToken(config.token);
    rest.put(Routes.applicationGuildCommands(APP_ID, SERVER_ID), { body: commands.map(cmd => cmd.build()) });

    const client = new Client({ intents: new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES])});
    client.on("ready", async () => {
        const guilds = await client.guilds.fetch();
        guilds.forEach(async partial => {
            const guild = await partial.fetch();
            console.log(`guild ${guild.id} - ${guild.name}`);
            const emojis = guild.emojis.fetch();
            (await emojis).forEach(emoji => {
                console.log(emoji.name);
            })
        });

    })


    client.on("messageCreate", async (message: Message): Promise<void> => {
        console.log("<-", message.content);
        if (message.author.bot) {
            return;
        }
        if (message.author.id === client.user?.id) {
            return;
        }

        for(const spec of messageTriggers) {
            const args = spec.parse(message)
            if (! args) { continue;}
            const response = await spec.worker(args);
            if (! response) {
                console.error(`${spec.name} failed to generate a reponse for ${message.content}`);
                continue;
            }
            if (message.hasThread) {
                message.thread?.send(response);
            } else {
                message.channel.send(response);
            }
        }
    })

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isCommand()) {
            return;
        }
        
        const name = interaction.commandName;
        const command = commandsByName.get(name);
        if (! command) {
            return;
        }
            const args = command.parse(interaction.options);
            const reply = await command.worker(args)
            return interaction.reply(reply);
    });

    client.login(config.token);

}