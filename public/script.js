const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

function fetchPokemonData(nameOrId) {
  fetch(apiUrl + nameOrId.toLowerCase())
    .then((response) => response.json())
    .then((data) => {
      displayPokemonData(data);
    })
    .catch((error) => console.log("Error fetching Pokemon data:", error));
}

function displayPokemonData(pokemon) {
  if (pokemon) {
    document.getElementById("pokemon-image").src =
      pokemon.sprites.front_default;
    document.getElementById("pokemon-name").textContent = pokemon.name;
    document.getElementById("pokemon-number").textContent = pokemon.id + " #";

    document.getElementById("pokemon-type").textContent =
      "Tipo: " + pokemon.types.map((type) => type.type.name).join(", ");
    document.getElementById("pokemon-height").textContent =
      "Altura: " + pokemon.height * 10 + " cm";
    document.getElementById("pokemon-weight").textContent =
      "Peso: " + pokemon.weight / 10 + " kg";
  } else {
    document.getElementById("pokemon-name").textContent = "";
    document.getElementById("pokemon-type").textContent = "";
    document.getElementById("pokemon-height").textContent = "";
    document.getElementById("pokemon-weight").textContent = "";
    let pokemonIndex = 1;
  }
}
/*
document.getElementById("prev-button").addEventListener("click", () => {
  pokemon.id = Math.max(1, pokemon.id - 1);
  fetchPokemonData(pokemon.id);
});

document.getElementById("next-button").addEventListener("click", () => {
  pokemon.id++;
  fetchPokemonData(pokemon.id);
});

fetchPokemonData(pokemonIndex);
*/
document.getElementById("search-button").addEventListener("click", () => {
  const pokemonInput = document.getElementById("pokemon-input").value;
  fetchPokemonData(pokemonInput);
});
