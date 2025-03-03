import { ChannelType } from 'discord.js';
import logMessage from '../logs/logger.js';

export default async function createChannel(guild, user, choice) {
    try {
        if (!user || !choice) {
            throw new Error('Użytkownik i wybór są wymagane.');
        }

        // Pobieranie poprawnej nazwy użytkownika
        const userName = user.username || user.globalName || user.tag;
        if (!userName) {
            throw new Error('Nie znaleziono nazwy użytkownika.');
        }

        const validChoices = ['rekrutacja', 'wspolpraca'];
        if (!validChoices.includes(choice.toLowerCase())) {
            throw new Error('Nieprawidłowy wybór. Wybierz "rekrutacja" lub "wspolpraca".');
        }

        // Sprawdzenie, czy kanał już istnieje
        const existingChannel = guild.channels.cache.find(c => c.name === `${userName.toLowerCase()}-${choice.toLowerCase()}`);
        if (existingChannel) {
            logMessage(`⚠️ Kanał ${existingChannel.name} już istnieje.`);
            return existingChannel;
        }

        // Pobieramy ID kategorii z .env
        const categoryId = process.env.TICKET_CATEGORY_ID;
        const category = categoryId ? guild.channels.cache.get(categoryId) : null;

        // Tworzenie kanału
        const channel = await guild.channels.create({
            name: `${userName.toLowerCase()}-${choice.toLowerCase()}`,
            type: ChannelType.GuildText, // Poprawiony typ
            topic: 'Wybierz opcję rekrutacji lub współpracy.',
            parent: category ? category.id : null,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: user.id,
                    allow: ['ViewChannel'],
                },
            ],
        });

        logMessage(`✅ Kanał ${channel.name} został utworzony.`);
        return channel;
    } catch (error) {
        logMessage(`❌ Błąd podczas tworzenia kanału: ${error.message}`, 'error');
    }
}
