const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        .setName('equipos-nba')
        .setDescription('Busca un equipo de la nba!')
        .addStringOption(option =>
            option
                .setName('equipo')
                .setDescription('Ingresa el nombre del equipo que buscas Ej: lakers ')
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const teamData = await getTeam();
            teams = [...teamData];
            const filteredTeam = teams.filter(teams => teams.Name.toLowerCase().startsWith(interaction.options.getString('equipo').toLowerCase()));
            const embed = createEmbed(filteredTeam);
            console.log(filteredTeam);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.editReply(`<@${interaction.user.id}> has colocado un equipo erroneo`);
        }
    },
};