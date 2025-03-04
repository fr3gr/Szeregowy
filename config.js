import dotenv from 'dotenv';
dotenv.config();

export default {
    guildId: process.env.GUILD_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    notificationChannelId: process.env.NOTIFICATION_CHANNEL_ID,
    ticketChannelId: process.env.TICKET_PANEL_CHANNEL_ID,
    generalChannelId: process.env.GENERAL_CHANNEL_ID,
    rulesChannelId: process.env.RULES_CHANNEL_ID,
    ticketCategoryId: process.env.TICKET_CATEGORY_ID,
    autoRoles: process.env.AUTO_ROLE_IDS ? process.env.AUTO_ROLE_IDS.split(',').map(id => id.trim()) : [],
};
