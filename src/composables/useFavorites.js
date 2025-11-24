import { ref, computed } from 'vue'
import { favorite } from '../utils/fetch.js'

const storedFavorites = localStorage.getItem('favorites')
const favorites = ref(storedFavorites ? JSON.parse(storedFavorites) : [])

export function useFavorites() {
  const toggleFavorite = async (pokemonId) => {
    const index = favorites.value.indexOf(pokemonId)
    try{
      if (index > -1) {
        favorites.value.splice(index, 1)
        await favorite({id:localStorage.getItem("id"), pokemon:pokemonId}, "delete")
      } else {
        favorites.value.push(pokemonId)
        await favorite({id:localStorage.getItem("id"), pokemon:pokemonId}, "save")
      }
      localStorage.setItem('favorites', JSON.stringify(favorites.value))

    }catch(error){

    }
    
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


