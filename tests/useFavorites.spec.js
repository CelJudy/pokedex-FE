import { describe, it, expect, vi, beforeEach } from 'vitest'

const favoriteMock = vi.fn().mockResolvedValue(undefined)

vi.mock('../src/utils/fetch.js', () => ({
  favorite: favoriteMock
}))

const createLocalStorageMock = (initialStore = {}) => {
  let store = { ...initialStore }

  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
    },
    setItem(key, value) {
      store[key] = value
    },
    removeItem(key) {
      delete store[key]
    },
    clear() {
      store = {}
    }
  }
}

const setupComposable = async (initialFavorites = []) => {
  const localStorageMock = createLocalStorageMock({
    favorites: JSON.stringify(initialFavorites),
    id: 'user-1'
  })

  global.localStorage = localStorageMock

  const { useFavorites } = await import('../src/composables/useFavorites.js')
  return useFavorites()
}

describe('useFavorites', () => {
  beforeEach(() => {
    vi.resetModules()
    favoriteMock.mockClear()
  })

  it('adds a Pokémon to favorites and persists it', async () => {
    const favoritesComposable = await setupComposable([])
    await favoritesComposable.toggleFavorite(25)

    expect(favoriteMock).toHaveBeenCalledWith(
      { id: 'user-1', pokemon: 25 },
      'save'
    )
    expect(favoritesComposable.favorites.value).toContain(25)
    expect(JSON.parse(global.localStorage.getItem('favorites'))).toContain(25)
    expect(favoritesComposable.isFavorite(25)).toBe(true)
  })

  it('removes a Pokémon from favorites and persists it', async () => {
    const favoritesComposable = await setupComposable([25])
    await favoritesComposable.toggleFavorite(25)

    expect(favoriteMock).toHaveBeenCalledWith(
      { id: 'user-1', pokemon: 25 },
      'delete'
    )
    expect(favoritesComposable.favorites.value).not.toContain(25)
    expect(JSON.parse(global.localStorage.getItem('favorites'))).not.toContain(25)
    expect(favoritesComposable.isFavorite(25)).toBe(false)
  })
})


