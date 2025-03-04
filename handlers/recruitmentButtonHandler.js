import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function handleRecruitmentButtonInteraction(interaction) {
    if (!interaction.guild) return;

    logMessage('➡️ Rozpoczęto obsługę przycisku rekrutacyjnego...');

    const member = interaction.member;
    const category = interaction.guild.channels.cache.get(config.ticketCategoryId);

    if (!category) {
        logMessage('❌ Nie znaleziono kategorii ticketów!', 'error');
        await interaction.reply({ content: 'Błąd: Kategoria nie istnieje!', ephemeral: true });
        return;
    }

    const channelName = `rekrutacja-${member.user.username}`;
    const existingChannel = interaction.guild.channels.cache.find(ch => ch.name === channelName);

    if (existingChannel) {
        logMessage(`⛔ Kanał rekrutacyjny już istnieje: ${existingChannel.name}`);
        await interaction.reply({ content: `Masz już otwarty kanał rekrutacyjny: ${existingChannel}`, ephemeral: true });
        return;
    }

    try {
        logMessage('🛠 Tworzenie nowego kanału...');

        const channel = await interaction.guild.channels.create({
            name: channelName,
            type: 0, // GuildText
            parent: category.id,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] }, // Ukrycie dla innych
                { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }, // Użytkownik może pisać
                { id: config.adminRoleId, allow: [PermissionFlagsBits.ViewChannel] }, // Admin ma dostęp
            ],
        });

        logMessage(`✅ Kanał rekrutacyjny utworzony: ${channel.name}`);

        // **📌 Wysyłanie panelu rekrutacyjnego**
        logMessage('📢 Wysyłanie panelu rekrutacyjnego...');

        const embed = new EmbedBuilder()
            .setTitle('📝 Panel rekrutacyjny')
            .setDescription('Wybierz opcję:')
            .setColor('#3498db')
            .addFields(
                { name: '✅ Zdał', value: 'Nadaje role: **Żołnierz + Szkolenie Podstawowe**' },
                { name: '⚠️ Zdał bez szkolenia', value: 'Nadaje rolę: **Szeregowy**' },
                { name: '❌ Nie zdał', value: 'Brak nadanych rang.' }
            )
            .setFooter({ text: 'Szeregowy | Projekt Wschód', iconURL: 'https://i.imgur.com/pjSZcfP.png' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('zdal')
                .setLabel('✅ Zdał')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('zdal_bez_szkolenia')
                .setLabel('⚠️ Zdał bez szkolenia')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('nie_zdal')
                .setLabel('❌ Nie zdał')
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });
        logMessage('✅ Panel rekrutacyjny wysłany!');
        await interaction.reply({ content: `Kanał rekrutacyjny został utworzony: ${channel}`, ephemeral: true });

    } catch (error) {
        logMessage(`❌ Błąd przy tworzeniu kanału: ${error.message}`, 'error');
        await interaction.reply({ content: 'Wystąpił błąd przy tworzeniu kanału!', ephemeral: true });
    }
}
