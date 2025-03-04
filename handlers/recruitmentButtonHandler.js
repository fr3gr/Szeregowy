import { PermissionsBitField } from 'discord.js';
import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleRecruitmentButtonInteraction(interaction) {
    const { customId, user, guild } = interaction;

    // Sprawdzamy, czy użytkownik ma odpowiednią rolę, aby obsługiwać przyciski
    const roleId = config.adminRoleId; // Ustaw odpowiednią rolę w konfiguracji
    const member = await guild.members.fetch(user.id);

    if (!member.roles.cache.has(roleId)) {
        logMessage(`❌ ${user.tag} próbował obsługiwać panel rekrutacyjny, ale nie ma odpowiednich uprawnień.`, 'warn');
        return interaction.reply({
            content: '❌ Nie masz uprawnień do obsługi tych przycisków.',
            ephemeral: true
        });
    }

    // Obsługa różnych naciśniętych przycisków
    try {
        switch (customId) {
            case 'zdal':
                await member.roles.add(config.soldierRoleId); // Dodajemy rolę "Żołnierz"
                await member.roles.add(config.basicTrainingRoleId); // Dodajemy rolę "Szkolenie Podstawowe"
                logMessage(`✅ ${user.tag} przeszedł rekrutację i otrzymał role: Żołnierz i Szkolenie Podstawowe.`);
                break;
            case 'zdal_bez_szkolenia':
                await member.roles.add(config.soldierRoleId); // Tylko "Żołnierz"
                logMessage(`✅ ${user.tag} przeszedł rekrutację bez szkolenia i otrzymał rolę: Żołnierz.`);
                break;
            case 'nie_zdal':
                logMessage(`❌ ${user.tag} nie zdał rekrutacji.`);
                break;
            default:
                throw new Error('Nieznany przycisk!');
        }

        await interaction.update({
            content: `✅ Wykonano opcję: ${customId}`,
            components: []
        });
    } catch (error) {
        logMessage(`❌ Błąd przy obsłudze przycisku: ${error.message}`, 'error');
        await interaction.reply({
            content: '❌ Wystąpił błąd podczas obsługi tego przycisku.',
            ephemeral: true
        });
    }
}
