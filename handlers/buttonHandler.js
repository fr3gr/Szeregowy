import createChannel from '../systems/channelCreator.js';
import logMessage from '../logs/logger.js';

export default async function handleButtonInteraction(interaction) {
    const { customId, user, guild } = interaction;

    logMessage(`🔎 Debug user: ${JSON.stringify(user, null, 2)}`);

    // Pobieranie bezpiecznej nazwy użytkownika
    const userName = user.username || user.globalName || user.tag;
    if (!userName) {
        logMessage('❌ Nie znaleziono nazwy użytkownika.', 'error');
        await interaction.reply({ content: '❌ Wystąpił błąd.', ephemeral: true });
        return;
    }

    logMessage(`✅ Próba utworzenia kanału dla ${userName} z wyborem ${customId}...`);

    try {
        const channel = await createChannel(guild, user, customId);
        if (channel) {
            await interaction.reply({ content: `✅ Twój kanał ${channel.name} został utworzony!`, ephemeral: true });
        } else {
            await interaction.reply({ content: '⚠️ Kanał już istnieje.', ephemeral: true });
        }
    } catch (error) {
        logMessage(`❌ Błąd: ${error.message}`, 'error');
        await interaction.reply({ content: '❌ Wystąpił błąd.', ephemeral: true });
    }
}
