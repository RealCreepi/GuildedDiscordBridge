import { Client, Webhook, Intents, TextChannel, Message, User } from "discord.js";
import { getLogger } from "log4js";
import EventEmitter from "events";
import { discord } from "../shared/config.json";

const logger = getLogger("discord");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const eventEmitter = new EventEmitter();

export type WHMsg = {
    content: string;
    pfp: string;
    name: string;
    channelName: string;
}

client.once("ready", () => {
    eventEmitter.emit("ready");
    logger.info("Logged in!");
});

client.on("messageCreate", async (msg: Message) => {
    if (!(msg.channel instanceof TextChannel)) return;
    if (msg.author.bot) return;
    
    const avatar = msg.author.avatarURL();
    try {
        eventEmitter.emit("message", {
            content: msg.content,
            pfp: msg.author.avatarURL() ? msg.author.avatarURL() : "https://discord.com",
            name: msg.author.username,
            channelName: msg.channel.name
        });
    } catch (e) {
        logger.error(e);
    }
});

eventEmitter.on("sendMsg", async (data: WHMsg) => {
    const guild = await client.guilds.fetch(discord.guild);
    if (!guild)
        return;
        
    const channel = guild.channels.cache.find(ch => ch.name == data.channelName);
    if (!channel || !(channel instanceof TextChannel)) {
        logger.error(`Couldn't find that channel! #${data.channelName}`);
        return;
    }

    const webhooks = await channel.fetchWebhooks();
    let webhook: Webhook;
    if (webhooks.size == 0) {
        webhook = await channel.createWebhook("Guilded");
    } else {
        webhook = webhooks.first()!;
    }
    
    await webhook.send({
        content: data.content,
        avatarURL: data.pfp,
        username: data.name,
        allowedMentions: {
            parse: ['users']
        }
    });
});

client.login(discord.token);

export default eventEmitter;