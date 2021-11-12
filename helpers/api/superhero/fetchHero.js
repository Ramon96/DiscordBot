const fetch = require("node-fetch");

async function fetchHero(Hero){
    console.log(Hero);
    const endpoint = `https://superheroapi.com/api/${process.env.superhero}`;
    const HeroId = await fetch(`${endpoint}/search/${Hero}`);
    const HeroData = await HeroId.json();

    return HeroData;
}

module.exports = fetchHero;