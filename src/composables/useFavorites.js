import { ref, computed } from 'vue'

const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

export function useFavorites() {
  const toggleFavorite = (pokemonId) => {
    const index = favorites.value.indexOf(pokemonId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(pokemonId)
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (pokemonId) => {
    return favorites.value.includes(pokemonId)
  }

  const getFavorites = computed(() => favorites.value)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavorites
  }
}


