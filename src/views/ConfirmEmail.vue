<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
      <div class="text-center">
        <!-- Loading State -->
        <div v-if="loading" class="py-8">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Confirmando correo...</h2>
          <p class="text-gray-600">Por favor espera un momento</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="py-8">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Correo confirmado!</h2>
          <p class="text-gray-600 mb-6">Tu correo electrónico ha sido confirmado exitosamente</p>
          <button
            @click="router.push('/')"
            class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-8">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Error al confirmar</h2>
          <p class="text-gray-600 mb-2">{{ errorMessage }}</p>
          <div class="mt-6 space-y-3">
            <button
              @click="retryConfirmation"
              class="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Reintentar
            </button>
            <button
              @click="router.push('/')"
              class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { confirmEmail } from '../utils/fetch'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

const retryConfirmation = async () => {
  loading.value = true
  error.value = false
  success.value = false
  errorMessage.value = ''
  
  await confirmEmailToken()
}

const confirmEmailToken = async () => {
  const token = route.params.token
  
  if (!token) {
    loading.value = false
    error.value = true
    errorMessage.value = 'Token no válido'
    return
  }

  try {
    const response = await confirmEmail(token)
    loading.value = false
    success.value = true
    error.value = false
  } catch (err) {
    loading.value = false
    error.value = true
    
    if (err.response) {
      // El servidor respondió con un código de error
      if (err.response.status === 400) {
        errorMessage.value = err.response.data.message || 'Token inválido o expirado'
      } else if (err.response.status === 404) {
        errorMessage.value = 'Token no encontrado'
      } else {
        errorMessage.value = err.response.data.message || 'Error al confirmar el correo'
      }
    } else if (err.request) {
      // La petición se hizo pero no hubo respuesta
      errorMessage.value = 'No se pudo conectar con el servidor. Verifica que esté corriendo.'
    } else {
      // Error al configurar la petición
      errorMessage.value = 'Error al procesar la solicitud'
    }
    console.error('Error al confirmar correo:', err)
  }
}

onMounted(() => {
  confirmEmailToken()
})
</script>


