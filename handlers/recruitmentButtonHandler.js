import { PermissionsBitField } from 'discord.js';
import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleRecruitmentButtonInteraction(interaction) {
    const { customId, user, guild } = interaction;

    // Check if user has required role to handle buttons
    const roleId = config.adminRoleId; // Assign the appropriate role ID in config
    const member = await guild.members.fetch(user.id);

    if (!member.roles.cache.has(roleId)) {
        logMessage(`❌ ${user.tag} tried to handle recruitment panel but lacks permissions.`, 'warn');
        return interaction.reply({
            content: '❌ You do not have permission to handle these buttons.',
            ephemeral: true
        });
    }

    // Handle different button presses
    try {
        switch (customId) {
            case 'zdal':
                await member.roles.add(config.soldierRoleId); // Add "Soldier" role
                await member.roles.add(config.basicTrainingRoleId); // Add "Basic Training" role
                logMessage(`✅ ${user.tag} passed recruitment and received roles: Soldier and Basic Training.`);
                break;
            case 'zdal_bez_szkolenia':
                await member.roles.add(config.soldierRoleId); // Only "Soldier" role
                logMessage(`✅ ${user.tag} passed recruitment without training and received role: Soldier.`);
                break;
            case 'nie_zdal':
                logMessage(`❌ ${user.tag} failed recruitment.`);
                break;
            default:
                throw new Error('Unknown button!');
        }

        await interaction.update({
            content: `✅ Executed option: ${customId}`,
            components: []
        });
    } catch (error) {
        logMessage(`❌ Error handling button: ${error.message}`, 'error');
        await interaction.reply({
            content: '❌ There was an error handling this button.',
            ephemeral: true
        });
    }
}
