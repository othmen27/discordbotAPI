import { Client, GatewayIntentBits, Partials } from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: './tokens.env' });
const API_KEY = process.env.OPENROUTER_API_KEY;;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: API_KEY,
})
const CHANNEL_ID = '1145831216537407550';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
async function getreply(prompt){
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages:[
            {
                role: 'user',
                content: prompt,
            },
        ],
    })
    return completion.choices[0].message.content
}
async function getreply4o(prompt){
  const completion = await openai.chat.completions.create({
    model : 'chatgpt-4o-latest',
    messages:[
      {
        role: 'user',
        content:prompt,
      },
    ],
  })
  return completion.choices[0].message.content
}
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isDM = message.channel.type === 1;
  const isTargetChannel = message.channel.id === CHANNEL_ID;
  if ((isDM || isTargetChannel)) {
    try {
      const response = await getreply(message.content)
      console.log(response);
      await message.reply(response);
    } catch (error) {
      console.error('Error fetching response:', error);
      await message.reply("Sorry, I couldn't fetch a reply");
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch(err => console.error('Error logging in:', err));
