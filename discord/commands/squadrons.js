const {getSquadron} = require('../../data/models/squadron.js')
module.exports = {
    command: 'squadrons',
    desc: 'Fetches information about each of the squadrons',
    callback: async (interaction) => { 
        const squadronInfo = await getSquadron(0);
        await interaction.reply(squadronInfo) // TO-DO: convert to embed
    },
}