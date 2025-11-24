<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-800">Pokédex</h1>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>

        <!-- Filtros -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Búsqueda por nombre -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <!-- Filtro por generación -->
          <select
            v-model="selectedGeneration"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las generaciones</option>
            <option
              v-for="generation in generationOptions"
              :key="generation.id"
              :value="generation.id"
            >
              {{ generation.label }}
            </option>
          </select>

          <!-- Filtro por tipo principal -->
          <select
            v-model="selectedPrimaryType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos (principal)</option>
            <option v-for="type in allTypes" :key="type" :value="type" class="capitalize">
              {{ type }}
            </option>
          </select>

          <!-- Filtro por segundo tipo -->
          <select
            v-model="selectedSecondaryType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos (secundario)</option>
            <option v-for="type in allTypes" :key="type" :value="type" class="capitalize">
              {{ type }}
            </option>
          </select>

          <!-- Botón de favoritos -->
          <button
            @click="showOnlyFavorites = !showOnlyFavorites"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2',
              showOnlyFavorites
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            <span class="text-xl">⭐</span>
            <span>{{ showOnlyFavorites ? 'Solo Favoritos' : 'Todos' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p class="mt-4 text-gray-600 text-lg">Cargando Pokémon...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 text-lg mb-4">{{ error }}</p>
        <button
          @click="fetchPokemon()"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Reintentar
        </button>
      </div>

      <!-- Contenido -->
      <div v-else class="space-y-8">
        <!-- Lista de Pokémon -->
        <div
          v-if="visiblePokemon.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <PokemonCard
            v-for="pokemon in visiblePokemon"
            :key="pokemon.id"
            :pokemon="pokemon"
            @click="selectedPokemon = pokemon"
          />
        </div>

        <!-- Sin resultados -->
        <div v-else class="text-center py-10">
          <p class="text-gray-600 text-lg">No se encontraron Pokémon con los filtros seleccionados</p>
        </div>

        <!-- Sentinel para scroll infinito -->
        <div ref="filteredScrollTrigger" class="h-8"></div>

        <div v-if="hasMoreFiltered && !loading" class="text-center py-10">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
          <p class="mt-4 text-gray-600">Cargando más Pokémon...</p>
        </div>
        <div v-else-if="!hasMoreFiltered && visiblePokemon.length > 0" class="text-center py-10 text-gray-500">
          <p>Has llegado al final de la Pokédex filtrada</p>
        </div>
      </div>
    </main>

    <!-- Modal de detalle -->
    <PokemonDetail
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="selectedPokemon = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemon } from '../composables/usePokemon'
import { useFavorites } from '../composables/useFavorites'
import { allTypes } from '../utils/pokemonTypes'
import PokemonCard from '../components/PokemonCard.vue'
import PokemonDetail from '../components/PokemonDetail.vue'

const router = useRouter()
const { pokemonList, loading, error, fetchPokemon } = usePokemon()
const { getFavorites } = useFavorites()

const searchQuery = ref('')
const selectedGeneration = ref('')
const selectedPrimaryType = ref('')
const selectedSecondaryType = ref('')
const showOnlyFavorites = ref(false)
const selectedPokemon = ref(null)
const filteredScrollTrigger = ref(null)
const filteredObserver = ref(null)
const visiblePokemon = ref([])
const filteredOffset = ref(0)
const PAGE_SIZE = 20
const hasMoreFiltered = ref(true)

const generationOptions = [
  { id: 'gen1', label: 'Generación 1 (Kanto)', range: [1, 151] },
  { id: 'gen2', label: 'Generación 2 (Johto)', range: [152, 251] },
  { id: 'gen3', label: 'Generación 3 (Hoenn)', range: [252, 386] },
  { id: 'gen4', label: 'Generación 4 (Sinnoh)', range: [387, 493] },
  { id: 'gen5', label: 'Generación 5 (Teselia)', range: [494, 649] },
  { id: 'gen6', label: 'Generación 6 (Kalos)', range: [650, 721] },
  { id: 'gen7', label: 'Generación 7 (Alola)', range: [722, 809] },
  { id: 'gen8', label: 'Generación 8 (Galar)', range: [810, 898] },
  { id: 'gen9', label: 'Generación 9 (Paldea)', range: [899, 1010] }
]

const filteredPokemon = computed(() => {
  let filtered = pokemonList.value

  // Filtro por generación
  if (selectedGeneration.value) {
    const generation = generationOptions.find(gen => gen.id === selectedGeneration.value)
    if (generation) {
      const [start, end] = generation.range
      filtered = filtered.filter(pokemon => pokemon.id >= start && pokemon.id <= end)
    }
  }

  // Filtro por favoritos
  if (showOnlyFavorites.value) {
    filtered = filtered.filter(pokemon => getFavorites.value.includes(pokemon.id))
  }

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query)
    )
  }

  // Filtro por tipo principal
  if (selectedPrimaryType.value) {
    filtered = filtered.filter(pokemon =>
      pokemon.types.some(type => type.type.name === selectedPrimaryType.value && type.slot === 1)
    )
  }

  // Filtro por segundo tipo
  if (selectedSecondaryType.value) {
    filtered = filtered.filter(pokemon =>
      pokemon.types.some(type => type.type.name === selectedSecondaryType.value && type.slot === 2)
    )
  }

  return filtered
})

const resetVisiblePokemon = () => {
  const initialSlice = filteredPokemon.value.slice(0, PAGE_SIZE)
  visiblePokemon.value = initialSlice
  filteredOffset.value = initialSlice.length
  hasMoreFiltered.value = filteredOffset.value < filteredPokemon.value.length
}

const loadMoreFilteredPokemon = () => {
  if (!hasMoreFiltered.value) return
  const nextSlice = filteredPokemon.value.slice(
    filteredOffset.value,
    filteredOffset.value + PAGE_SIZE
  )
  if (nextSlice.length === 0) {
    hasMoreFiltered.value = false
    return
  }
  visiblePokemon.value = [...visiblePokemon.value, ...nextSlice]
  filteredOffset.value += nextSlice.length
  hasMoreFiltered.value = filteredOffset.value < filteredPokemon.value.length
}

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('id')
  localStorage.removeItem('favorites')
  router.push('/')
}

onMounted(() => {
  fetchPokemon()
})

onUnmounted(() => {
  if (filteredObserver.value) {
    filteredObserver.value.disconnect()
  }
})

watch(
  () => filteredPokemon.value,
  () => {
    resetVisiblePokemon()
  },
  { immediate: true }
)

watch(
  () => filteredScrollTrigger.value,
  (el) => {
    if (filteredObserver.value) {
      filteredObserver.value.disconnect()
    }

    if (!el) return

    filteredObserver.value = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading.value) {
          loadMoreFilteredPokemon()
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0
      }
    )

    filteredObserver.value.observe(el)
  },
  { immediate: true }
)
</script>


