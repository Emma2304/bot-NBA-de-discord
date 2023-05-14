const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear-nota')
        .setDescription('Crear una nueva nota!')
        .addStringOption(option =>
            option
                .setName('contenido')
                .setDescription('El contenido de la nota')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const content = interaction.options.getString('contenido');

            const created = new Date().toISOString();

            const statement = db.prepare(`
        INSERT INTO notes (content, user_id, created_at) 
        VALUES (?, ?, ?)
        `);

            statement.run(content, interaction.user.id, created);

            await interaction.reply(`Nueva nota: ${content}. Creada!`);
        } catch (error) {
            if (error.message === 'UNIQUE constraint failed: users.user_id') {
                await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            }
        }
    },
};