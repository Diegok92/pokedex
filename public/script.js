const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";

function fetchPokemonData(nameOrId) {
	fetch(apiUrl + nameOrId.toLowerCase())
		.then((response) => response.json())
		.then((data) => {
			displayPokemonData(data);
			fetchPokemonSpeciesData(data.id);
		})
		.catch((error) => console.log("Error fetching Pokemon data:", error));
}

function fetchPokemonSpeciesData(id) {
	fetch(speciesUrl + id)
		.then((response) => response.json())
		.then((data) => {
			fetchEvolutionChain(data.evolution_chain.url);
		})
		.catch((error) =>
			console.log("Error fetching Pokemon species data:", error)
		);
}

function fetchEvolutionChain(url) {
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			displayEvolutions(data.chain);
		})
		.catch((error) => console.log("Error fetching evolution chain:", error));
}

function displayPokemonData(pokemon) {
	if (pokemon) {
		const pokemonImage = document.getElementById("pokemon-image");
		pokemonImage.classList.remove("fade-in");
		void pokemonImage.offsetWidth; // Reinicia la animación
		pokemonImage.src = pokemon.sprites.front_default;
		pokemonImage.classList.add("fade-in");

		document.getElementById("pokemon-name").textContent = pokemon.name;
		document.getElementById("pokemon-number").textContent =
			"Número: #" + pokemon.id;
		document.getElementById("pokemon-type").textContent =
			"Tipo: " + pokemon.types.map((type) => type.type.name).join(", ");
		document.getElementById("pokemon-height").textContent =
			"Altura: " + pokemon.height * 10 + " cm";
		document.getElementById("pokemon-weight").textContent =
			"Peso: " + pokemon.weight / 10 + " kg";

		document.getElementById("home-button").classList.remove("hidden");
	}
}

function displayEvolutions(chain) {
	const evolutionContainer = document.getElementById("evolution-container");
	evolutionContainer.innerHTML = "";

	let current = chain;

	while (current) {
		fetch(apiUrl + current.species.name)
			.then((response) => response.json())
			.then((data) => {
				const evolutionImage = document.createElement("img");
				evolutionImage.src = data.sprites.front_default;
				evolutionImage.className = "evolution-image";
				evolutionContainer.appendChild(evolutionImage);
			});

		current = current.evolves_to[0];
	}
}

document.getElementById("search-button").addEventListener("click", () => {
	const pokemonInput = document.getElementById("pokemon-input").value;
	fetchPokemonData(pokemonInput);
});

document.getElementById("pokemon-input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		fetchPokemonData(e.target.value);
	}
});

document.getElementById("home-button").addEventListener("click", () => {
	document.getElementById("pokemon-image").src =
		"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/404px-International_Pok%C3%A9mon_logo.svg.png";
	document.getElementById("pokemon-name").textContent = "";
	document.getElementById("pokemon-number").textContent = "";
	document.getElementById("pokemon-type").textContent = "";
	document.getElementById("pokemon-height").textContent = "";
	document.getElementById("pokemon-weight").textContent = "";
	document.getElementById("evolution-container").innerHTML = "";
	document.getElementById("home-button").classList.add("hidden");
});
