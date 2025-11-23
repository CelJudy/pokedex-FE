<template>
  <div
    class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
    @click="$emit('click', pokemon)"
  >
    <div class="relative">
      <img
        :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
        :alt="pokemon.name"
        class="w-full h-48 object-contain bg-gradient-to-b from-gray-100 to-white p-4"
      />
      <button
        @click.stop="toggleFavorite"
        class="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-yellow-50 transition-all"
      >
        <span :class="isFavorite ? 'text-yellow-500' : 'text-gray-400'" class="text-2xl">
          {{ isFavorite ? '⭐' : '☆' }}
        </span>
      </button>
    </div>

    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-xl font-bold text-gray-800 capitalize">
          {{ pokemon.name }}
        </h3>
        <span class="text-sm font-semibold text-gray-500">
          #{{ String(pokemon.id).padStart(3, '0') }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="type in pokemon.types"
          :key="type.slot"
          :class="getTypeColor(type.type.name)"
          class="px-3 py-1 rounded-full text-white text-xs font-semibold capitalize"
        >
          {{ type.type.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavorites } from '../composables/useFavorites'
import { getTypeColor } from '../utils/pokemonTypes'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const { toggleFavorite: toggleFavoritePokemon, isFavorite: checkFavorite } = useFavorites()

const isFavorite = computed(() => checkFavorite(props.pokemon.id))

const toggleFavorite = () => {
  toggleFavoritePokemon(props.pokemon.id)
}
</script>

