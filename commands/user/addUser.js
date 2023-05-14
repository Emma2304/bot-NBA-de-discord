const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('agregar-usuario')
        .setDescription('Agrega un usuario a nuestro bot de la NBA!')
        .addStringOption(option =>
            option
                .setName('nombre')
                .setDescription('Tu nombre')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('apellido')
                .setDescription('Tu apellido')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('equipo-fav')
                .setDescription('Tu equipo fav de la NBA')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const name = interaction.options.getString('nombre');
            const lastName = interaction.options.getString('apellido');
            const equipoFav = interaction.options.getString('equipo-fav');
            const id = interaction.user.id;

            const created = new Date().toISOString();

            const statement = db.prepare(`
        INSERT INTO users (user_id, first_name, last_name, equipo_fav, created_at) 
        VALUES (?, ?, ?, ?, ?)
        `);

            statement.run(id, name, lastName, equipoFav, created);

            await interaction.reply(`Bienvenido <@${id}> al servidor!`);
        } catch (error) {
            if (error.message === 'UNIQUE constraint failed: users.user_id') {
                await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            }
        }
    },
};