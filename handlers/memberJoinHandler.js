import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleMemberJoin(member) {
    if (!config.autoRoles || config.autoRoles.length === 0) {
        logMessage('⚠️ Brak skonfigurowanych ról do nadania nowym członkom.', 'warn');
        return;
    }

    try {
        await member.roles.add(config.autoRoles);
        logMessage(`✅ Nadano automatyczne role dla ${member.user.tag}: ${config.autoRoles.join(', ')}`);
    } catch (error) {
        logMessage(`❌ Błąd przy nadawaniu ról dla ${member.user.tag}: ${error.message}`, 'error');
    }
}
