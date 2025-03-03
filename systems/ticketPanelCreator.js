import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } from 'discord.js';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function createTicketPanel(guild) {
    logMessage('🚨 Próba utworzenia panelu ticketów...');

    if (!guild) {
        logMessage('❌ Błąd: Brak obiektu guild!', 'error');
        return;
    }

    const channel = guild.channels.cache.get(config.ticketChannelId);
    if (!channel) {
        logMessage('❌ Nie znaleziono kanału na panel ticketów!', 'error');
        return;
    }

    logMessage(`✅ Znaleziono kanał na panel ticketów: ${channel.name}`);

    try {
        // Usuwanie starych paneli (jeśli istnieją)
        const messages = await channel.messages.fetch({ limit: 100 });
        const existingPanels = messages.filter(msg => msg.embeds.length > 0 && msg.embeds[0].title === '📩 Wybierz opcję');
        
        if (existingPanels.size > 0) {
            logMessage('⛔️ Usuwanie starych paneli ticketów...');
            await Promise.all(existingPanels.map(msg => msg.delete()));
        }

        // Tworzenie nowego embeda
        const embed = new EmbedBuilder()
            .setTitle('📩 Wybierz opcję')
            .setDescription('🔹 **Rekrutacja** – Jeśli chcesz dołączyć do zespołu, wybierz tę opcję.\n' +
                            '🤝 **Współpraca** – Jeśli chcesz nawiązać współpracę, wybierz tę opcję.')
            .setColor('#3498db')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/2099/2099058.png') // Możesz dostosować ikonę
            .setFooter({ 
                text: 'Szeregowy | Projekt Wschód | © 2025',
                iconURL: 'https://i.imgur.com/pjSZcfP.png' // Zamień to na link do logo
            });

        // Tworzenie przycisków
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('rekrutacja')
                .setLabel('🔹 Rekrutacja')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('wspolpraca')
                .setLabel('🤝 Współpraca')
                .setStyle(ButtonStyle.Success)
        );

        await channel.send({ embeds: [embed], components: [row] });

        logMessage('✅ Panel ticketów został stworzony na kanale!');
    } catch (error) {
        logMessage(`❌ Błąd podczas tworzenia panelu ticketów: ${error.message}`, 'error');
    }
}
