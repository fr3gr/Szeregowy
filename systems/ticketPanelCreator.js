import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } from 'discord.js';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function createTicketPanel(guild) {
    logMessage('🚨 Attempting to create a ticket panel...');

    if (!guild) {
        logMessage('❌ Error: No guild object!', 'error');
        return;
    }

    const channel = guild.channels.cache.get(config.ticketChannelId);
    if (!channel) {
        logMessage('❌ Ticket panel channel not found!', 'error');
        return;
    }

    logMessage(`✅ Found ticket panel channel: ${channel.name}`);

    try {
        // Remove existing panels (if any)
        const messages = await channel.messages.fetch({ limit: 100 });
        const existingPanels = messages.filter(msg => msg.embeds.length > 0 && msg.embeds[0].title === '📩 Choose an option');
        
        if (existingPanels.size > 0) {
            logMessage('⛔️ Deleting old ticket panels...');
            await Promise.all(existingPanels.map(msg => msg.delete()));
        }

        // Create a new embed
        const embed = new EmbedBuilder()
            .setTitle('📩 Choose an option')
            .setDescription('🔹 **Recruitment** – Choose this option if you want to join our team.\n' +
                            '🤝 **Cooperation** – Choose this option if you want to collaborate with us.')
            .setColor('#3498db')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/2099/2099058.png') 
            .setFooter({ 
                text: 'Szeregowy | Projekt Wschód | © 2025',
                iconURL: 'https://i.imgur.com/pjSZcfP.png' 
            });

        // Create buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('rekrutacja')
                .setLabel('🔹 Recruitment')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('wspolpraca')
                .setLabel('🤝 Cooperation')
                .setStyle(ButtonStyle.Success)
        );

        await channel.send({ embeds: [embed], components: [row] });

        logMessage('✅ Ticket panel has been created on the channel!');
    } catch (error) {
        logMessage(`❌ Error while creating the ticket panel: ${error.message}`, 'error');
    }
}
