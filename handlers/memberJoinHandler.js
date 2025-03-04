import logMessage from '../logs/logger.js';
import config from '../config.js';

export default async function handleMemberJoin(member) {
    console.log(`➡️ Użytkownik ${member.user.tag} dołączył. Próbuję nadać role:`, config.autoRoleIds);

    // Sprawdzamy, czy w konfiguracji są role
    if (!config.autoRoleIds || config.autoRoleIds.length === 0) {
        logMessage('⚠️ Brak skonfigurowanych ról do nadania nowym członkom.', 'warn');
        return;
    }

    try {
        // Logowanie, jakie role próbujemy przypisać
        logMessage(`✅ Próbuję nadać role: ${config.autoRoleIds.join(', ')}`, 'info');

        // Nadajemy role
        await member.roles.add(config.autoRoleIds);
        logMessage(`✅ Nadano automatyczne role dla ${member.user.tag}: ${config.autoRoleIds.join(', ')}`, 'info');
    } catch (error) {
        logMessage(`❌ Błąd przy nadawaniu ról dla ${member.user.tag}: ${error.message}`, 'error');
    }
}
