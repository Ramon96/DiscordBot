import fetch from "node-fetch";

async function fetchPokemon(pokemonName: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

  try {
    const response = await fetch(url)
      .then((res) => res.json())
      .catch((error) => {
        throw "doesnt exist";
      });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default fetchPokemon;
