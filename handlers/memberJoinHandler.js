import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleMemberJoin(member) {
    console.log(`➡️ Użytkownik ${member.user.tag} dołączył. Próbuję nadać role:`, config.autoRoleIds);

    if (!config.autoRoleIds.length) {
        logMessage('⚠️ Brak skonfigurowanych ról do nadania nowym członkom.', 'warn');
        return;
    }

    try {
        await member.roles.add(config.autoRoleIds);
        logMessage(`✅ Nadano automatyczne role dla ${member.user.tag}: ${config.autoRoleIds.join(', ')}`, 'info');
    } catch (error) {
        logMessage(`❌ Błąd przy nadawaniu ról dla ${member.user.tag}: ${error.message}`, 'error');
    }
}
