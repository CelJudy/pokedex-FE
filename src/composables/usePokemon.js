import { ref } from 'vue'
import axios from 'axios'

const LIMIT = 20
const pokemonList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)
const hasMore = ref(true)
const offset = ref(0)

const mapPokemonDetails = async (results) => {
  const pokemonPromises = results.map(async (pokemon) => {
    const detailResponse = await axios.get(pokemon.url)
    return detailResponse.data
  })

  return Promise.all(pokemonPromises)
}

const fetchChunk = async (currentOffset) => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${currentOffset}`
  )
  const detailedPokemon = await mapPokemonDetails(response.data.results)

  return {
    detailedPokemon,
    nextOffset: currentOffset + LIMIT,
    hasNext: Boolean(response.data.next)
  }
}

export function usePokemon() {
  const fetchPokemon = async () => {
    loading.value = true
    error.value = null
    offset.value = 0
    hasMore.value = true

    try {
      const { detailedPokemon, nextOffset, hasNext } = await fetchChunk(0)
      pokemonList.value = detailedPokemon
      offset.value = nextOffset
      hasMore.value = hasNext
    } catch (err) {
      error.value = 'Error al cargar los Pokémon'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const loadMorePokemon = async () => {
    if (!hasMore.value || loadingMore.value) return

    loadingMore.value = true
    error.value = null

    try {
      const { detailedPokemon, nextOffset, hasNext } = await fetchChunk(offset.value)
      pokemonList.value = [...pokemonList.value, ...detailedPokemon]
      offset.value = nextOffset
      hasMore.value = hasNext
    } catch (err) {
      error.value = 'Error al cargar más Pokémon'
      console.error(err)
    } finally {
      loadingMore.value = false
    }
  }

  return {
    pokemonList,
    loading,
    loadingMore,
    hasMore,
    error,
    fetchPokemon,
    loadMorePokemon
  }
}


