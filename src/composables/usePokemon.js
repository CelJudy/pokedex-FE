import { ref } from 'vue'
import axios from 'axios'

const TOTAL_POKEMON = 1010
const pokemonList = ref([])
const loading = ref(false)
const error = ref(null)

export function usePokemon() {
  const fetchPokemon = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`
      )
      const results = response.data.results

      const pokemonPromises = results.map(async (pokemon) => {
        const detailResponse = await axios.get(pokemon.url)
        return detailResponse.data
      })

      pokemonList.value = await Promise.all(pokemonPromises)
    } catch (err) {
      error.value = 'Error al cargar los Pokémon'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    pokemonList,
    loading,
    error,
    fetchPokemon
  }
}


