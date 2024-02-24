const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let pokemonIndex = 1;

function fetchPokemonData(index) {
  fetch(apiUrl + index)
    .then((response) => response.json())
    .then((data) => {
      displayPokemonData(data);
    })
    .catch((error) => console.log("Error fetching Pokemon data:", error));
}

function displayPokemonData(pokemon) {
  document.getElementById("pokemon-image").src = pokemon.sprites.front_default;
  document.getElementById("pokemon-name").textContent = pokemon.name;
  document.getElementById("pokemon-type").textContent =
    "Tipo: " + pokemon.types.map((type) => type.type.name).join(", ");
  document.getElementById("pokemon-height").textContent =
    "Altura: " + pokemon.height;
  document.getElementById("pokemon-weight").textContent =
    "Peso: " + pokemon.weight;
}

document.getElementById("prev-button").addEventListener("click", () => {
  pokemonIndex = Math.max(1, pokemonIndex - 1);
  fetchPokemonData(pokemonIndex);
});

document.getElementById("next-button").addEventListener("click", () => {
  pokemonIndex++;
  fetchPokemonData(pokemonIndex);
});

// Cargar datos del primer Pokémon al cargar la página
fetchPokemonData(pokemonIndex);
