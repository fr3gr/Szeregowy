import logMessage from '../logs/logger.js';
import createTicketPanel from '../systems/ticketPanelCreator.js';
import config from '../config.js';

export default async function ready(client) {
    logMessage(`✅ Bot ${client.user.tag} jest online!`);

    try {
        const guild = await client.guilds.fetch(config.guildId);
        await createTicketPanel(guild); // Tworzenie panelu po starcie bota
    } catch (error) {
        logMessage(`❌ Błąd podczas tworzenia panelu ticketów: ${error.message}`, 'error');
    }
}
