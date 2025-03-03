import { EmbedBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import config from '../config.js';
import logMessage from '../logs/logger.js';

export default async function guildMemberAdd(member) {
    const guild = member.guild;
    const welcomeChannel = guild.channels.cache.get(config.notificationChannelId);
    const logChannel = guild.channels.cache.get(config.logChannelId);

    const joinDate = DateTime.now().setZone('Europe/Warsaw').toFormat('dd.LL.yyyy, HH:mm:ss');

    const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('👋 Nowy użytkownik dołączył do serwera!')
        .setDescription(`Witaj <@${member.id}> na serwerze! 🎉\n\nZapraszamy do zapoznania się z kanałami:\n\n` +
            `📌 <#${config.ticketChannelId}> – tutaj możesz dołączyć do naszego zespołu.\n` +
            `📌 <#${config.generalChannelId}> – tutaj znajdziesz najważniejsze informacje.\n` +
            `📌 <#${config.rulesChannelId}> – przeczytaj regulamin przed rozpoczęciem przygody.`)
        .addFields(
            { name: '👤 Nazwa użytkownika', value: `\`${member.user.tag}\``, inline: true },
            { name: '📅 Data dołączenia', value: `\`${joinDate}\``, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: `Szeregowy | Projekt Wschód © ${new Date().getFullYear()}` });

    try {
        if (welcomeChannel) {
            welcomeChannel.send({ embeds: [embed] });
            logMessage(`Wysłano powitanie dla użytkownika ${member.user.tag} na kanale powitania.`);
        } else {
            logMessage(`Brak kanału powitania: ${config.notificationChannelId}.`);
        }

        if (logChannel) {
            logChannel.send(`[LOG] ${member.user.tag} dołączył do serwera. Data: ${joinDate}`);
            logMessage(`Wysłano log o dołączeniu użytkownika ${member.user.tag}.`);
        } else {
            logMessage(`Brak kanału logów: ${config.logChannelId}.`);
        }

        logMessage(`${member.user.tag} dołączył do serwera. Data: ${joinDate}`);
    } catch (error) {
        logMessage(`Błąd przy przetwarzaniu dołączenia użytkownika ${member.user.tag}: ${error.message}`);
    }
}
