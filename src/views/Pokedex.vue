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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Búsqueda por nombre -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

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

      <!-- Lista de Pokémon -->
      <div v-else-if="filteredPokemon.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <PokemonCard
          v-for="pokemon in filteredPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
          @click="selectedPokemon = pokemon"
        />
      </div>

      <!-- Sin resultados -->
      <div v-else class="text-center py-20">
        <p class="text-gray-600 text-lg">No se encontraron Pokémon con los filtros seleccionados</p>
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
import { ref, computed, onMounted } from 'vue'
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
const selectedPrimaryType = ref('')
const selectedSecondaryType = ref('')
const showOnlyFavorites = ref(false)
const selectedPokemon = ref(null)

const filteredPokemon = computed(() => {
  let filtered = pokemonList.value

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

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('id')
  localStorage.removeItem('favorites')
  router.push('/')
}

onMounted(() => {
  fetchPokemon(151) // Cargar los primeros 151 Pokémon
})
</script>


