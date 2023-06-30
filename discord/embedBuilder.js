const { EmbedBuilder } = require('discord.js');

/**
 * Helper method for creating an embed
 * @param {string} title The embed's title
 * @param {string} desc The embed's description 
 * @param {string} icon An image URL
 * @param {Array} fields An array of field objects [{name: string, value: any, inline: boolean}, ...]
 * @returns {Object} An embed object
 */
module.exports = (title, desc, icon, fields) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(desc)
        .setThumbnail(icon || 'https://tr.rbxcdn.com/71dc791749307b68c2c76022e30edcbd/150/150/Image/Png')
        .addFields(fields)
        .setColor('FF0000')
        .setTimestamp()
        .setFooter({text: 'Powered by Avarian Automation', iconURL: 'https://tr.rbxcdn.com/71dc791749307b68c2c76022e30edcbd/150/150/Image/Png'});
    return embed
}