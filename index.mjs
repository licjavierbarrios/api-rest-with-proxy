// para ejecutar archivo: node --experimental-fetch index.mjs
const STAR_WARS_ACCEPTED_RESOURCES = [
    "people",
    "planets",
    "films",
    "species",
    "vehicles",
    "starships",
];
const STAR_WARS_API_URL = "https://swapi.dev/api";

const POKE_API_ACCEPTED_RESOURCES = [
    "pokemon",
    'type',
    'ability',
    'egg-group',
]
const POKE_API_URL = "https://pokeapi.co/api/v2";

const createApi = (url, acceptedResources) => {
	return new Proxy(
		{},
		{
			get: (target, prop) => {
                return async (id, queryParams) => {
                    if (!acceptedResources.includes(prop)) 
                        return Promise.reject({error: `Resource ${prop} not found`});

                    let qs = queryParams 
                        ? `?${new URLSearchParams(queryParams).toString()}` 
                        : '';

                    const resource = `${url}/${prop}/${id}${qs}`;
                    console.log({resource});
					const res = await fetch(resource);
                    if (res.ok) return res.json();
                    throw new Error(`Error al obtener datos de ${resource}`);

				};
			},
		}
	);
};

const api = createApi(STAR_WARS_API_URL, STAR_WARS_ACCEPTED_RESOURCES);
const luke =  await api.people(1);
const c3po =  await api.people(2);
const planet = await api.planets(1);
const starship = await api.starships(2);
const film = await api.films(1);

console.log({luke: luke.name});
console.log({c3po: c3po.name});
console.log({planet: planet.name});
console.log({starship: starship.name});
console.log({film: film.title});

const pokeApi = createApi(POKE_API_URL, POKE_API_ACCEPTED_RESOURCES);
const pikachu = await pokeApi.pokemon('pikachu', {limit: 10, moreInfo: true, whatever: 2});

console.log({pikachu: pikachu.name});
