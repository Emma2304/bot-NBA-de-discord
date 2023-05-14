const { SlashCommandBuilder, bold } = require('discord.js');
const db = require('../../db/db');
const { stripIndent, stripIndents } = require('common-tags');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('actualizar-usuario')
        .setDescription('Actualiza tu usuario!')
        .addStringOption(option =>
            option
                .setName('equipo')
                .setDescription('Ingresa tu nuevo equipo fav')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const equipoFav = interaction.options.getString('equipo');
            const id = interaction.user.id;

            const userOld = db.prepare(`
                SELECT equipo_fav FROM users
                WHERE user_id = ?
            `).get(id);

            if (!userOld) return await interaction.reply('Ups! tu usuario no se encuentra registrado.')

            const statement = db.prepare(`
            UPDATE users
            SET equipo_fav = ?
            WHERE user_id = ?
        `);

            statement.run(equipoFav, id);

            await interaction.reply(stripIndents`
            <@${id}>
            Se actualizo tu equipo favorito de ${bold(userOld.equipo_fav)}
            A ${bold(equipoFav)}
            `);

        } catch (error) {
            console.log(error);
            if (error.message === 'UNIQUE constraint failed: users.user_id') {
                await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            }
        }
    },
};