import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import logMessage from './logs/logger.js';
import handleButtonInteraction from './handlers/buttonHandler.js';
import config from './config.js';
import ready from './events/ready.js'; // Importujemy event ready

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Przekazujemy client do eventu `ready.js`
client.once('ready', () => ready(client));

client.on('interactionCreate', async (interaction) => {
    try {
        await handleButtonInteraction(interaction);
    } catch (error) {
        logMessage(`❌ Błąd przy obsłudze interakcji: ${error.message}`, 'error');
    }
});d

client.login(process.env.BOT_TOKEN);
