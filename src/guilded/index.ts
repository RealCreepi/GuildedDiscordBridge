import { Client, Message, TeamChannel } from "@guildedjs/guilded.js";
import { getLogger } from "log4js";
import { guilded } from "../shared/config.json";
import { send, createWH, deleteWH } from "./webhook";
import EventEmitter from "events";
import { WHMsg } from "@/discord";

const client = new Client();
const eventEmitter = new EventEmitter();

const logger = getLogger("guilded");

client.on("messageCreate", async (msg: Message) => {
    if (!msg) return;
    if (msg.authorID == client.user?.id) return;
    if (!(msg.channel instanceof TeamChannel)) return;
    if (msg.raw.botId || msg.raw.webhookId) return;
    try {
        if (msg.raw.content?.document.nodes[0].nodes[0].object == "text" && msg.raw.content?.document.nodes[0].nodes[0].leaves![0].text.length >= 1) {
            const content = msg.raw.content?.document.nodes[0].nodes[0].leaves![0].text;
            const user = await client.rest.get(`/users/${msg.raw.createdBy}/profilev3`);
            
            eventEmitter.emit("message", {
                content,
                pfp: user.profilePicture,
                name: user.name ? user.name : "someone",
                channelName: msg.channel.name
            });
        }
    } catch (e) {
        logger.error(e);
    }
});

client.once("raw", () => {
    logger.info("Logged in!");
    eventEmitter.emit("ready");
});

client.login({
    email: guilded.email,
    password: guilded.password
});

eventEmitter.on("sendMsg", async (data: WHMsg) => {
    const channel = client.channels.cache.find(ch => (ch instanceof TeamChannel) && ch.teamID == guilded.team && ch.name == data.channelName);
    if (!channel) {
        logger.error(`Couldn't find that channel! #${data.channelName}`);
        return;
    }
    channel.send(`**__${data.name}__**:\n ${data.content}`, );
});

export default eventEmitter;