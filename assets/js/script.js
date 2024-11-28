const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/";

function fetchPokemonData(nameOrId) {
	fetch(apiUrl + nameOrId.toLowerCase())
		.then((response) => response.json())
		.then((data) => {
			document.getElementById("welcome-message").classList.add("hidden");
			document.getElementById("pokemon-image").classList.remove("hidden");
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
			document.getElementById(
				"region"
			).textContent = `Región: ${data.generation.name
				.replace("generation-", "")
				.toUpperCase()}`;
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

function fetchStrengthsAndWeaknesses(types) {
	const typeUrl = "https://pokeapi.co/api/v2/type/";
	const strengths = [];
	const weaknesses = [];

	Promise.all(
		types.map((type) =>
			fetch(typeUrl + type.type.name)
				.then((response) => response.json())
				.then((typeData) => {
					strengths.push(
						...typeData.damage_relations.double_damage_to.map((t) => t.name)
					);
					weaknesses.push(
						...typeData.damage_relations.double_damage_from.map((t) => t.name)
					);
				})
		)
	).then(() => {
		document.getElementById("strengths").textContent = `Fuertes contra: ${[
			...new Set(strengths),
		].join(", ")}`;
		document.getElementById("weaknesses").textContent = `Débiles contra: ${[
			...new Set(weaknesses),
		].join(", ")}`;
	});
}

function displayPokemonData(pokemon) {
	if (pokemon) {
		const pokemonImage = document.getElementById("pokemon-image");
		pokemonImage.classList.remove("fade-in");
		void pokemonImage.offsetWidth; // Reinicia la animacion
		pokemonImage.src = pokemon.sprites.front_default;
		pokemonImage.classList.add("fade-in");

		pokemonImage.onclick = () => {
			new Audio(
				`https://play.pokemonshowdown.com/audio/cries/${pokemon.name}.mp3`
			).play();
		};

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

		fetchStrengthsAndWeaknesses(pokemon.types);
	}
}

function displayEvolutions(chain) {
	const evolutionContainer = document.getElementById("evolution-container");
	evolutionContainer.innerHTML = "<h3>Evoluciones:</h3>";

	let current = chain;

	while (current) {
		fetch(apiUrl + current.species.name)
			.then((response) => response.json())
			.then((data) => {
				const evolutionImage = document.createElement("img");
				evolutionImage.src = data.sprites.front_default;
				evolutionImage.className = "evolution-image";
				const evolutionInfo = document.createElement("p");
				evolutionInfo.textContent = `${data.name} (#${data.id})`;
				evolutionContainer.appendChild(evolutionImage);
				evolutionContainer.appendChild(evolutionInfo);
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
	document.getElementById("pokemon-image").classList.add("hidden");
	document.getElementById("welcome-message").classList.remove("hidden");
	document.getElementById("pokemon-name").textContent = "";
	document.getElementById("pokemon-number").textContent = "";
	document.getElementById("pokemon-type").textContent = "";
	document.getElementById("pokemon-height").textContent = "";
	document.getElementById("pokemon-weight").textContent = "";
	document.getElementById("evolution-container").innerHTML = "";
	document.getElementById("strengths").textContent = "";
	document.getElementById("weaknesses").textContent = "";
	document.getElementById("region").textContent = "";
	document.getElementById("home-button").classList.add("hidden");
});
