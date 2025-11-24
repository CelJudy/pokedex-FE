<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
        <p class="text-gray-600">Inicia sesión para comenzar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ errors.general }}
        </div>

        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div class="font-semibold mb-1">¡Inicio de sesión exitoso!</div>
          <div class="text-sm whitespace-pre-wrap">{{ successMessage }}</div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            :disabled="loading"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="tu@correo.com"
            @blur="validateEmail"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            :disabled="loading"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="••••••••"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 mb-3">¿No tienes una cuenta?</p>
        <button
          @click="router.push('/register')"
          class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
        >
          Registrarse
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../utils/fetch'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const successMessage = ref('')
const errors = ref({
  email: '',
  password: '',
  general: ''
})

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.value.email = 'El correo es requerido'
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'El formato del correo no es válido'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = 'La contraseña es requerida'
  } else {
    errors.value.password = ''
  }
}

const handleLogin = async () => {
  validateEmail()
  validatePassword()

  if (!errors.value.email && !errors.value.password) {
    loading.value = true
    errors.value.general = ''
    successMessage.value = ''

    try {
      const response = await login({
        email: email.value,
        password: password.value
      })

      // Si el login es exitoso
      if (response) {
        // Formatear la respuesta para mostrarla
        let message = ''
        if (typeof response === 'string') {
          message = response
        } else if (response.message) {
          message = response.message
        } else if (response.data && response.data.message) {
          message = response.data.message
        } else {
          // Mostrar toda la respuesta como JSON si no hay mensaje específico
          message = JSON.stringify(response, null, 2)
        }
        
        successMessage.value = message
        
        // Autenticar automáticamente después del login
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', response.data.user.email)
        localStorage.setItem('id', response.data.user.id)
        localStorage.setItem('favorites', response.data.pokemon)
        

        
        // Esperar un momento para que el usuario vea el mensaje antes de redirigir
        router.push('/pokedex')

      }
    } catch (error) {
      // Manejar errores de la petición
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          errors.value.general = 'Credenciales inválidas'
        } else if (error.response.status === 400) {
          errors.value.general = error.response.data?.message || 'Datos inválidos'
        } else if (error.response.status === 404) {
          errors.value.general = 'Usuario no encontrado'
        } else {
          errors.value.general = error.response.data?.message || 'Error al iniciar sesión'
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errors.value.general = 'No se pudo conectar con el servidor. Verifica que esté corriendo.'
      } else {
        // Error al configurar la petición
        errors.value.general = 'Error al procesar la solicitud'
      }
      console.error('Error en el login:', error)
    } finally {
      loading.value = false
    }
  }
}
</script>

