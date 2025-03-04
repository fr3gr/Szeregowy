import { Client, GatewayIntentBits } from 'discord.js';
import handleButtonInteraction from './handlers/buttonHandler.js';
import handleRecruitmentButtonInteraction from './handlers/recruitmentButtonHandler.js';
import guildMemberAdd from './events/guildMemberAdd.js';
import logMessage from './logs/logger.js';
import dotenv from 'dotenv';  // ✅ Tylko jeden import dotenv!
import config from './config.js';
import ready from './events/ready.js';

dotenv.config(); // ✅ Ładowanie zmiennych z .env

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.once('ready', async () => {
    await ready(client);
    logMessage(`ℹ️ Załadowane autoRoles: ${JSON.stringify(config.autoRoleIds)}`, 'info'); // ✅ poprawiona nazwa zmiennej
});

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            if (['zdal', 'zdal_bez_szkolenia', 'nie_zdal'].includes(interaction.customId)) {
                await handleRecruitmentButtonInteraction(interaction);
            } else {
                await handleButtonInteraction(interaction);
            }
        }
    } catch (error) {
        logMessage(`❌ Error handling interaction: ${error.message}`, 'error');
    }
});

client.on('guildMemberAdd', async (member) => {
    await guildMemberAdd(member);
});

client.login(process.env.DISCORD_TOKEN); // ✅ Poprawiona nazwa zmiennej
