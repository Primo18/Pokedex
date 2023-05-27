const pokemonList = document.querySelector("#listaPokemon");
const navList = document.querySelector(".nav-list");
const URL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

// Función para obtener los datos de la API
const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la petición: " + response.status);
    }
    const data = await response.json();
    return getPokemonData(data.results);
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Función para obtener los datos de un Pokemon
const getPokemonData = async (results) => {
  try {
    const pokemonData = results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      if (!response.ok) {
        throw new Error("Error en la petición: " + response.status);
      }
      return response.json();
    });

    const pokemon = await Promise.all(pokemonData);
    return pokemon;
  } catch (error) {
    console.log("Error: ", error);
  }
};

// Función para mostrar los datos en el HTML
const showData = async () => {
  const pokemonData = await getData(URL);

  pokemonData.forEach((data) => {
    const item = document.createElement("div");
    item.classList.add("pokemon");

    const pokemonId = data.id.toString().padStart(3, "0");
    const pokemonName = data.name;
    const pokemonImage = data.sprites.other["official-artwork"].front_default;
    const pokemonTypes = data.types.map((type) => type.type.name);
    const pokemonHeight = data.height / 10;
    const pokemonWeight = data.weight / 10;

    // Array de tipos de Pokemon para mostrar en el HTML
    const typesHTML = pokemonTypes.map((type) => `<p class="${type.toLowerCase()} tipo">${type}</p>`).join("");

    item.innerHTML = `
      <div class="pokemon-id-back">#${pokemonId}</div>
      <div class="pokemon-imagen">
          <img src="${pokemonImage}" alt="${pokemonName}" />
      </div>
      <div class="pokemon-info">
        <div class="nombre-contenedor">
          <p class="pokemon-id">#${pokemonId}</p>
          <h2 class="pokemon-nombre">${pokemonName}</h2>
        </div>
        <div class="pokemon-tipos">
        ${typesHTML}
        </div>
        <div class="pokemon-stats">
          <p class="stat">${pokemonHeight}m</p>
          <p class="stat">${pokemonWeight}kg</p>
        </div>
      </div>
    `;

    pokemonList.appendChild(item);
  });
};

showData();

// Función para mostrar los datos de un tipo específico
const showPokemonByType = (type) => {
  const pokemonItems = Array.from(pokemonList.getElementsByClassName("pokemon"));

  pokemonItems.forEach((pokemonItem) => {
    const pokemonTypes = Array.from(pokemonItem.getElementsByClassName("tipo"));
    const shouldShow = pokemonTypes.some((pokemonType) => pokemonType.classList.contains(type));
    pokemonItem.style.display = shouldShow ? "block" : "none";
  });
};

// Función para mostrar todos los Pokémon
const showAllPokemon = () => {
  const pokemonItems = Array.from(pokemonList.getElementsByClassName("pokemon"));
  pokemonItems.forEach((pokemonItem) => {
    pokemonItem.style.display = "block";
  });
};

// Event listener para los botones del header
navList.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("btn-header")) {
    const type = target.id;

    if (type === "ver-todos") {
      showAllPokemon();
    } else {
      showPokemonByType(type);
    }
  }
});
