import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function createRecruitmentPanel(channel) {
    logMessage('🎟 Creating recruitment evaluation panel...');

    if (!channel) {
        logMessage('❌ Error: No channel to send the panel to!', 'error');
        return;
    }

    try {
        const embed = new EmbedBuilder()
            .setTitle('📝 Recruitment Evaluation')
            .setDescription('Select the appropriate option based on the recruitment results:')
            .setColor('#2ecc71')
            .setFooter({
                text: 'Szeregowy | Projekt Wschód | © 2025',
                iconURL: 'https://i.imgur.com/pjSZcfP.png'
            });

        // Create buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('zdal')
                .setLabel('✅ Passed')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('zdal_bez_szkolenia')
                .setLabel('🟢 Passed without training')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('nie_zdal')
                .setLabel('❌ Failed')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });

        logMessage('✅ Recruitment panel with buttons has been created on the channel!');
    } catch (error) {
        logMessage(`❌ Error while creating the recruitment panel: ${error.message}`, 'error');
    }
}
