import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn()
    }
  }
})

describe('usePokemon', () => {
  beforeEach(() => {
    vi.resetModules()
    axios.get.mockReset()
  })

  it('fetches and stores pokemon data successfully', async () => {
    const listResponse = {
      data: {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2' }
        ]
      }
    }

    const bulbasaur = { data: { id: 1, name: 'bulbasaur' } }
    const ivysaur = { data: { id: 2, name: 'ivysaur' } }

    axios.get
      .mockResolvedValueOnce(listResponse)
      .mockResolvedValueOnce(bulbasaur)
      .mockResolvedValueOnce(ivysaur)

    const { usePokemon } = await import('../src/composables/usePokemon.js')
    const { pokemonList, loading, error, fetchPokemon } = usePokemon()

    await fetchPokemon()

    expect(axios.get).toHaveBeenCalledTimes(3)
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('https://pokeapi.co/api/v2/pokemon?limit=')
    )
    expect(pokemonList.value).toHaveLength(2)
    expect(pokemonList.value[0].name).toBe('bulbasaur')
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('sets an error message when the request fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'))

    const { usePokemon } = await import('../src/composables/usePokemon.js')
    const { pokemonList, loading, error, fetchPokemon } = usePokemon()

    await fetchPokemon()

    expect(pokemonList.value).toHaveLength(0)
    expect(error.value).toBe('Error al cargar los Pokémon')
    expect(loading.value).toBe(false)
  })
})


