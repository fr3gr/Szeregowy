import { PermissionsBitField } from 'discord.js';
import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleRecruitmentButtonInteraction(interaction) {
    const { customId, user, guild } = interaction;

    // Sprawdzamy, czy użytkownik ma odpowiednią rolę do obsługi przycisków
    const roleId = config.adminRoleId; // Przypisz odpowiednie ID roli w configu
    const member = await guild.members.fetch(user.id);

    if (!member.roles.cache.has(roleId)) {
        logMessage(`❌ ${user.tag} próbował obsłużyć panel rekrutacyjny, ale nie ma odpowiednich uprawnień.`, 'warn');
        return interaction.reply({
            content: '❌ Nie masz uprawnień do obsługi tych przycisków.',
            ephemeral: true
        });
    }

    // Obsługa różnych przycisków
    try {
        switch (customId) {
            case 'zdal':
                await member.roles.add(config.soldierRoleId); // Dodanie roli "Żołnierz"
                await member.roles.add(config.basicTrainingRoleId); // Dodanie roli "Szkolenie Podstawowe"
                logMessage(`✅ ${user.tag} zdał rekrutację i otrzymał role: Żołnierz oraz Szkolenie Podstawowe.`);
                break;
            case 'zdal_bez_szkolenia':
                await member.roles.add(config.soldierRoleId); // Tylko rola "Żołnierz"
                logMessage(`✅ ${user.tag} zdał rekrutację bez szkolenia i otrzymał rolę: Żołnierz.`);
                break;
            case 'nie_zdal':
                logMessage(`❌ ${user.tag} nie zdał rekrutacji.`);
                break;
            default:
                throw new Error('Nieznany przycisk!');
        }

        await interaction.update({
            content: `✅ Zrealizowano opcję: ${customId}`,
            components: []
        });
    } catch (error) {
        logMessage(`❌ Błąd podczas obsługi przycisku: ${error.message}`, 'error');
        await interaction.reply({
            content: '❌ Wystąpił błąd podczas obsługi tego przycisku.',
            ephemeral: true
        });
    }
}
