import { Client, GatewayIntentBits } from 'discord.js';
import handleButtonInteraction from './handlers/buttonHandler.js';
import handleRecruitmentButtonInteraction from './handlers/recruitmentButtonHandler.js';
import handleMemberJoin from './handlers/memberJoinHandler.js';
import logMessage from './logs/logger.js';
import dotenv from 'dotenv';
import config from './config.js';
import ready from './events/ready.js'; // Importujemy poprawiony event "ready"

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', async () => {
    await ready(client); // Wywołujemy obsługę ready, która zawiera logi oraz tworzenie panelu ticketów
});

client.on('interactionCreate', async (interaction) => {
    try {
        const guild = await client.guilds.fetch(config.guildId);

        if (interaction.isButton()) {
            if (['zdal', 'zdal_bez_szkolenia', 'nie_zdal'].includes(interaction.customId)) {
                await handleRecruitmentButtonInteraction(interaction);
            } else {
                await handleButtonInteraction(interaction);
            }
        }
    } catch (error) {
        logMessage(`❌ Błąd przy obsłudze interakcji: ${error.message}`, 'error');
    }
});

client.on('guildMemberAdd', async (member) => {
    await handleMemberJoin(member);
});

client.login(process.env.BOT_TOKEN);
