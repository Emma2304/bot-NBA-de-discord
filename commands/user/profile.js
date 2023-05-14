const { SlashCommandBuilder, bold, EmbedBuilder } = require('discord.js');
const db = require('../../db/db');
const { stripIndents } = require('common-tags');
const { default: axios } = require('axios');
let teams = [];

const getTeam = async () => {
    const { data } = await axios.get('https://api.sportsdata.io/v3/nba/scores/json/teams?key=40b971328d5647c798bb736f674cd414');
    return data;
};

const createEmbed = (filteredTeam) => {
    const image = filteredTeam[0].WikipediaLogoUrl;
    const exampleEmbed = new EmbedBuilder()
        .setColor([9, 142, 228])
        .setTitle(`${filteredTeam[0].City} ${filteredTeam[0].Name}`)
        .setThumbnail(image)
        .addFields(
            { name: 'Conferencia', value: `${filteredTeam[0].Conference}`, inline: true },
            { name: 'Division', value: `${filteredTeam[0].Division}`, inline: true },
            { name: 'Siglas', value: `${filteredTeam[0].Key}`, inline: true },
        )
        .setImage(image)


    return exampleEmbed;
};


module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Muestra tu perfil!'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const id = interaction.user.id;
            const statement = db.prepare(`
            SELECT * FROM users
            WHERE user_id = ?
        `);
            const user = statement.get(id);
            if (!user) return await interaction.reply('Ups! tu usuario no se encuentra registrado.')

            const teamData = await getTeam();
            teams = [...teamData];
            const filteredTeam = teams.filter(teams => teams.Name.toLowerCase().startsWith(user.equipo_fav.toLowerCase()));
            const embed = createEmbed(filteredTeam);

            await interaction.editReply(stripIndents`
            ${bold('Usuario:')} <@${id}>
            ${bold('Nombre:')} ${user.first_name} ${user.last_name} 
            ${bold('Equipo Fav:')} ${user.equipo_fav}
            `);
            await interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.log(error);
            // if (error.message === 'UNIQUE constraint failed: users.user_id') {
            //     await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            // }
        }
    },
};