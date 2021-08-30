import { Client } from "@guildedjs/guilded.js";
import fetch from "node-fetch";

export const send = async (url: string, data: string, avatar: string) => {
    try {
        const deta = await fetch(`https://media.guilded.gg/webhooks/${url}`, {
            method: "post",
            body: JSON.stringify({
                content: data,
                avatar_url: avatar
            }),
            headers: { "Content-Type": "application/json" },
        });
        return {
            code: 0,
            data: await deta.json()
        }
    } catch (e) {
        return {
            code: 1,
            error: e
        }
    }
}

export const createWH = async (channelID: string, name: string, client: Client) => {
    try {
        const webhook = await client.rest.post("/webhooks", {
            name: name ? name : "someone",
            channelId: channelID
        });
        return {
            code: 0,
            data: `${webhook.id}/${webhook.token}`
        }
    } catch (e) {
        return {
            code: 1,
            error: e
        }  
    }
}

export const deleteWH = async (webhookID: string, client: Client) => {
    try {
        await client.rest.delete(`/webhooks/${webhookID}`);
        return {
            code: 0
        }
    } catch (e) {
        return {
            code: 1,
            error: e
        }  
    }
}