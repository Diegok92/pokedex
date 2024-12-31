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
			document.getElementById(
				"region"
			).textContent = `Generation: ${data.generation.name
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
		const strengthsList = strengths.map((t) => `<li>${t}</li>`).join("");
		const weaknessesList = weaknesses.map((t) => `<li>${t}</li>`).join("");

		document.getElementById(
			"strengths"
		).innerHTML = `Strong vs: <ul>${strengthsList}</ul>`;
		document.getElementById(
			"weaknesses"
		).innerHTML = `Weak vs: <ul>${weaknessesList}</ul>`;
	});
}

function displayPokemonData(pokemon) {
	if (pokemon) {
		const pokemonImage = document.getElementById("pokemon-image");
		pokemonImage.classList.remove("fade-in");
		void pokemonImage.offsetWidth; // Reinicio la animacion
		pokemonImage.src = pokemon.sprites.front_default;
		pokemonImage.classList.add("fade-in");

		pokemonImage.onclick = () => {
			new Audio(
				`https://play.pokemonshowdown.com/audio/cries/${pokemon.name}.mp3`
			).play();
		};

		document.getElementById("pokemon-name").textContent = pokemon.name;
		document.getElementById("pokemon-number").textContent = "#" + pokemon.id;
		document.getElementById("pokemon-type").textContent =
			"Type: " + pokemon.types.map((type) => type.type.name).join(", ");
		document.getElementById("pokemon-height").textContent =
			"Height: " + pokemon.height * 10 + " cm";
		document.getElementById("pokemon-weight").textContent =
			"weight: " + pokemon.weight / 10 + " kg";

		// Oculto el mensaje de bienvenida despues de buscar un Pokemon
		const welcomeMessage = document.getElementById("welcome-message");
		if (welcomeMessage) {
			welcomeMessage.style.display = "none";
		}

		document.getElementById("home-button").classList.remove("hidden");

		fetchStrengthsAndWeaknesses(pokemon.types);
	}
}

function displayEvolutions(chain) {
	const evolutionContainer = document.getElementById("evolution-container");
	evolutionContainer.innerHTML = "<h3>Discovery Order:</h3>";

	let evolutions = [];
	let current = chain;

	// Recolectar todas las evoluciones en un array
	while (current) {
		evolutions.push(current.species.name);
		current = current.evolves_to[0];
	}

	// Obtener los datos de cada evolución y ordenarlos por ID
	Promise.all(
		evolutions.map((name) =>
			fetch(apiUrl + name)
				.then((response) => response.json())
				.then((data) => ({
					id: data.id,
					name: data.name,
					image: data.sprites.front_default,
				}))
		)
	).then((evolutionsData) => {
		// Ordenar las evoluciones por ID
		evolutionsData.sort((a, b) => a.id - b.id);

		// Renderizar las evoluciones ordenadas
		evolutionsData.forEach((evolution) => {
			const evolutionItem = document.createElement("div");
			evolutionItem.className = "evolution-item";

			const evolutionImage = document.createElement("img");
			evolutionImage.src = evolution.image;
			evolutionImage.className = "evolution-image";

			const evolutionInfo = document.createElement("p");
			evolutionInfo.textContent = `${evolution.name} (#${evolution.id})`;

			evolutionItem.appendChild(evolutionInfo);
			evolutionItem.appendChild(evolutionImage);

			evolutionContainer.appendChild(evolutionItem);
		});
	});
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
	document.getElementById("pokemon-image").src = "assets/img/pokedex.png";
	document.getElementById("pokemon-name").textContent = "";
	document.getElementById("pokemon-number").textContent = "";
	document.getElementById("pokemon-type").textContent = "";
	document.getElementById("pokemon-height").textContent = "";
	document.getElementById("pokemon-weight").textContent = "";
	document.getElementById("evolution-container").innerHTML = "";
	document.getElementById("strengths").textContent = "";
	document.getElementById("weaknesses").textContent = "";
	document.getElementById("region").textContent = "";

	// Muestro de nuevo el mensaje de bienvenida
	const welcomeMessage = document.getElementById("welcome-message");
	if (welcomeMessage) {
		welcomeMessage.style.display = "block";
	}

	document.getElementById("home-button").classList.add("hidden");
});
