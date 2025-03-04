import { ChannelType } from 'discord.js';
import logMessage from '../logs/logger.js';

export default async function createChannel(guild, user, choice) {
    try {
        if (!user || !choice) {
            throw new Error('User and choice are required.');
        }

        // Get the user's safe name
        const userName = user.username || user.globalName || user.tag;
        if (!userName) {
            throw new Error('User name not found.');
        }

        const validChoices = ['rekrutacja', 'wspolpraca'];
        if (!validChoices.includes(choice.toLowerCase())) {
            throw new Error('Invalid choice. Choose "rekrutacja" or "wspolpraca".');
        }

        // Check if the channel already exists
        const existingChannel = guild.channels.cache.find(c => c.name === `${userName.toLowerCase()}-${choice.toLowerCase()}`);
        if (existingChannel) {
            logMessage(`⚠️ Channel ${existingChannel.name} already exists.`);
            return existingChannel;
        }

        // Get the category ID from .env
        const categoryId = process.env.TICKET_CATEGORY_ID;
        const category = categoryId ? guild.channels.cache.get(categoryId) : null;

        // Create the channel
        const channel = await guild.channels.create({
            name: `${userName.toLowerCase()}-${choice.toLowerCase()}`,
            type: ChannelType.GuildText, 
            topic: 'Choose the recruitment or cooperation option.',
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

        logMessage(`✅ Channel ${channel.name} has been created.`);
        return channel;
    } catch (error) {
        logMessage(`❌ Error while creating channel: ${error.message}`, 'error');
    }
}
