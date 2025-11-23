export const pokemonTypeColors = {
  fire: 'bg-pokemon-fire',
  water: 'bg-pokemon-water',
  grass: 'bg-pokemon-grass',
  electric: 'bg-pokemon-electric',
  psychic: 'bg-pokemon-psychic',
  ice: 'bg-pokemon-ice',
  dragon: 'bg-pokemon-dragon',
  dark: 'bg-pokemon-dark',
  fairy: 'bg-pokemon-fairy',
  normal: 'bg-pokemon-normal',
  fighting: 'bg-pokemon-fighting',
  flying: 'bg-pokemon-flying',
  poison: 'bg-pokemon-poison',
  ground: 'bg-pokemon-ground',
  rock: 'bg-pokemon-rock',
  bug: 'bg-pokemon-bug',
  ghost: 'bg-pokemon-ghost',
  steel: 'bg-pokemon-steel',
}

export const allTypes = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon',
  'dark', 'fairy', 'normal', 'fighting', 'flying', 'poison', 'ground',
  'rock', 'bug', 'ghost', 'steel'
]

export function getTypeColor(type) {
  return pokemonTypeColors[type] || 'bg-gray-500'
}


