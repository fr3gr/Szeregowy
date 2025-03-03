import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function createRecruitmentPanel(channel) {
    logMessage('🎟 Tworzenie panelu z przyciskami do oceny rekrutacji...');

    if (!channel) {
        logMessage('❌ Błąd: Brak kanału do wysłania panelu!', 'error');
        return;
    }

    try {
        const embed = new EmbedBuilder()
            .setTitle('📝 Ocena Rekrutacji')
            .setDescription('Wybierz odpowiednią opcję w zależności od wyników rekrutacji:')
            .setColor('#2ecc71')
            .setFooter({
                text: 'Szeregowy | Projekt Wschód | © 2025',
                iconURL: 'https://i.imgur.com/pjSZcfP.png' // Zamień to na link do logo
            });

        // Tworzenie przycisków
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('zdal')
                .setLabel('✅ Zdał')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('zdal_bez_szkolenia')
                .setLabel('🟢 Zdał bez szkolenia')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('nie_zdal')
                .setLabel('❌ Nie zdał')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });

        logMessage('✅ Panel rekrutacji z przyciskami został stworzony na kanale!');
    } catch (error) {
        logMessage(`❌ Błąd podczas tworzenia panelu rekrutacji: ${error.message}`, 'error');
    }
}
