const { SlashCommandBuilder, bold, User } = require('discord.js');
const db = require('../../db/db');
const { stripIndents } = require('common-tags');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('borrar-usuario')
        .setDescription('Elimina tu usuario!'),

    async execute(interaction) {
        try {
            const id = interaction.user.id;
            console.log(id);

            const statement = db.prepare(`
            DELETE FROM users
            WHERE user_id = ?
        `);
            statement.run(id);
            
            await interaction.reply(stripIndents`
            <@${id}>
            Tu usuario ha sido eliminado 
            `);

        } catch (error) {
            console.log(error);
            if (error.message === 'UNIQUE constraint failed: users.user_id') {
                await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            }
        }
    },
};