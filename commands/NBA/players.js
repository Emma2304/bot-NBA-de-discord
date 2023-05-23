const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder, bold } = require('discord.js');

let players = [];

const getPlayer = async () => {
    const { data } = await axios.get('https://api.sportsdata.io/v3/nba/scores/json/Players?key=40b971328d5647c798bb736f674cd414');
    return data;
};

const createEmbed = async (filteredPlayer, salario) => {
    //console.log(filteredPlayer);
    const image = filteredPlayer.PhotoUrl;
    const exampleEmbed = new EmbedBuilder()
        .setColor([220, 28, 28])
        .setTitle(`${filteredPlayer.FirstName} ${filteredPlayer.LastName}`)
        .setThumbnail(image)
        .addFields(
            { name: 'Pais de nacimiento', value: `${bold(filteredPlayer.BirthCountry)}`, inline: true },
            { name: 'Ciudad de nacimiento', value: `${bold(filteredPlayer.BirthCity)}`, inline: true },
            { name: 'Colegiatura', value: `${bold(filteredPlayer.College)}`, inline: true },
            { name: 'Posicion', value: `${bold(filteredPlayer.Position)}`, inline: true },
            { name: 'Equipo', value: `${bold(filteredPlayer.Team)}`, inline: true },
            { name: 'Dorsal', value: `${bold(String(filteredPlayer.Jersey))}`, inline: true },
            { name: 'Salario', value: `${bold(String(salario))}`, inline: true },
            { name: 'Height', value: `${bold(String(filteredPlayer.Height))}`, inline: true },
            { name: 'Weight', value: `${bold(String(filteredPlayer.Weight))}`, inline: true },
            { name: 'Fecha de nacimiento', value: `${bold(String(filteredPlayer.BirthDate).split('T')[0])}`, inline: true },
        );


    return exampleEmbed;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jugadores-nba')
        .setDescription('Busca un jugador de la nba!')
        .addStringOption(option =>
            option
                .setName('jugador')
                .setDescription('Ingresa el nombre del jugador que buscas Ej: Stephen ')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const playerData = await getPlayer();
            const base = interaction.options.getString('jugador').toLowerCase();
            players = [...playerData];
            const filteredPlayer = players.find(player => player.FirstName.toLowerCase() === base);
            //console.log(filteredPlayer);
            const number = filteredPlayer.Salary;
            const salario = new Intl.NumberFormat('de-US', { style: 'currency', currency: 'USD' }).format(number);
            const embed = await createEmbed(filteredPlayer, salario);
            // console.log(filteredPlayer);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.log(error);
            await interaction.editReply(`<@${interaction.user.id}> has colocado un nombre erroneo`);
        }
    },
};