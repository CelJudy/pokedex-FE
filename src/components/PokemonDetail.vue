<template>
  <div
    v-if="pokemon"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
      <div class="relative">
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
        >
          <span class="text-2xl">×</span>
        </button>

        <div class="bg-gradient-to-br from-blue-400 to-purple-500 p-8 text-white">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-4xl font-bold capitalize">{{ pokemon.name }}</h2>
            <span class="text-2xl font-semibold">#{{ String(pokemon.id).padStart(3, '0') }}</span>
          </div>

          <img
            :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
            :alt="pokemon.name"
            class="w-64 h-64 mx-auto object-contain"
          />
        </div>

        <div class="p-6">
          <div class="mb-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800">Tipos</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="type in pokemon.types"
                :key="type.slot"
                :class="getTypeColor(type.type.name)"
                class="px-4 py-2 rounded-full text-white font-semibold capitalize"
              >
                {{ type.type.name }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800">Estadísticas</h3>
            <div class="space-y-2">
              <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center">
                <span class="w-32 text-sm font-medium text-gray-700 capitalize">
                  {{ stat.stat.name.replace('-', ' ') }}
                </span>
                <div class="flex-1 bg-gray-200 rounded-full h-4 mr-2">
                  <div
                    class="bg-blue-500 h-4 rounded-full transition-all"
                    :style="{ width: `${(stat.base_stat / 255) * 100}%` }"
                  ></div>
                </div>
                <span class="w-12 text-sm font-semibold text-gray-800">{{ stat.base_stat }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-bold mb-3 text-gray-800">Habilidades</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="ability in pokemon.abilities"
                :key="ability.ability.name"
                class="px-4 py-2 bg-gray-100 rounded-full text-gray-800 font-medium capitalize"
              >
                {{ ability.ability.name.replace('-', ' ') }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Dimensiones</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Altura</p>
                <p class="text-2xl font-bold text-gray-800">{{ (pokemon.height / 10).toFixed(1) }} m</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Peso</p>
                <p class="text-2xl font-bold text-gray-800">{{ (pokemon.weight / 10).toFixed(1) }} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getTypeColor } from '../utils/pokemonTypes'

defineProps({
  pokemon: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>


