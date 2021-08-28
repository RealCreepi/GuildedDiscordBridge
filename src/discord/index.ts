import { Client, WebhookClient, Webhook, Intents, TextChannel } from 'discord.js';
import { token_discord } from '../shared/config.json';


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });


client.once('ready', () => {
    console.log('Logged in!');
});

client.on("message", function(message){
    if (!(message.channel instanceof TextChannel)) return;
    if (message.author.bot) return;
    
    let avatar = message.author.avatarURL();
    console.log(message.content);
    message.channel.createWebhook(message.author.username, {
        avatar: avatar ? avatar : undefined,
    })
        .then(webhook => {
            console.log("A");
            webhook.send(message.content)
                .then(() => {
                    webhook.delete()
                        .catch(console.error);
                })
                .catch(console.error);
        
        })
        .catch(console.error);
});

client.login(token_discord);
