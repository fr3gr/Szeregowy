import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 DEBUG: AUTO_ROLE_IDS:', process.env.AUTO_ROLE_IDS);

export default {
    autoRoleIds: process.env.AUTO_ROLE_IDS ? process.env.AUTO_ROLE_IDS.split(',') : [],
    adminRoleId: process.env.ADMIN_ROLE_ID,
    soldierRoleId: process.env.SOLDIER_ROLE_ID,
    basicTrainingRoleId: process.env.BASIC_TRAINING_ROLE_ID,
    ticketChannelId: process.env.TICKET_PANEL_CHANNEL_ID,
    notificationChannelId: process.env.NOTIFICATION_CHANNEL_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    guildId: process.env.GUILD_ID,
};
