const { spawnSync } = require('child_process');
exports.discordBot = (e, callback) => {
  // Run the bot
  const child = spawnSync('node', ['bot.js'], { stdio: 'inherit' });
  callback(null, 'Success');
};