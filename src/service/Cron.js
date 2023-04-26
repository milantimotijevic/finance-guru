const { CronJob } = require('cron');
const UserService = require('./User');
const Logger = require('../util/Logger');

// periodically refresh connections for all users
const refreshJob = new CronJob('*/5 * * * *', (async () => {
    try {
        Logger.info('Cron starting (refreshing users connections)');
        const users = await UserService.getUsers();
        const userIds = users.map(user => user.id);
        const promises = userIds.map(userId => UserService.refreshConnections(userId));
        await Promise.all(promises);
        Logger.info(`Successfully requested connections refresh for ${userIds.length} users`);
    } catch (err) {
        Logger.error(`Failed to request connections refresh for one or more users. Error: ${err}`);
    }
}), null, false, 'Europe/London');

refreshJob.start();