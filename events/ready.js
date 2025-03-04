import logMessage from '../logs/logger.js';
import createTicketPanel from '../systems/ticketPanelCreator.js';
import config from '../config.js';

export default async function ready(client) {
    logMessage(`✅ Bot ${client.user.tag} jest online!`);

    try {
        logMessage(`🔍 Fetching guild with ID: ${config.guildId}`);

        const guild = client.guilds.cache.get(config.guildId) || await client.guilds.fetch(config.guildId);

        if (!guild) {
            logMessage('❌ Error: Guild not found!', 'error');
            return;
        }

        logMessage(`✅ Found guild: ${guild.name} (ID: ${guild.id})`);

        await createTicketPanel(guild);
    } catch (error) {
        logMessage(`❌ Error while creating ticket panel: ${error.message}`, 'error');
    }
}
