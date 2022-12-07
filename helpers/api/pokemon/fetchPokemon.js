const fetch = require('node-fetch');

async function fetchPokemon(pokemonName) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        const response = await fetch(url)
            .then(res => res.json())
            .catch(error => {
                throw 'doesnt exist';
            });
        return response;
    } catch (error) {
        console.log(error);
    }

}

module.exports = fetchPokemon;