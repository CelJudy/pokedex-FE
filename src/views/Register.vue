<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Pokédex</h1>
        <p class="text-gray-600">Crea tu cuenta</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ errors.general }}
        </div>

        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div class="font-semibold mb-1">¡Registro exitoso!</div>
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

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            :disabled="loading"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="••••••••"
            @blur="validateConfirmPassword"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600 mb-3">¿Ya tienes una cuenta?</p>
        <button
          @click="router.push('/')"
          class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {register} from '../utils/fetch'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const successMessage = ref('')
const errors = ref({
  email: '',
  password: '',
  confirmPassword: '',
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
  } else if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  } else {
    errors.value.password = ''
  }
}

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  } else {
    errors.value.confirmPassword = ''
  }
}

const handleRegister = async () => {
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (!errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
    loading.value = true
    errors.value.general = ''
    successMessage.value = ''

    try {
      const response = await register({
        email: email.value,
        password: password.value
      })

      // Si el registro es exitoso
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

        // Guardar token si viene en la respuesta
        if (response.token) {
          localStorage.setItem('token', response.token)
        } else if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        

      }
    } catch (error) {
      // Manejar errores de la petición
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 409) {
          errors.value.general = 'Este correo ya está registrado'
        } else if (error.response.status === 400) {
          errors.value.general = error.response.data?.message || 'Datos inválidos'
        } else {
          errors.value.general = error.response.data?.message || 'Error al registrar usuario'
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errors.value.general = 'No se pudo conectar con el servidor. Verifica que esté corriendo.'
      } else {
        // Error al configurar la petición
        errors.value.general = 'Error al procesar la solicitud'
      }
      console.log('Error en el registro:', error)
    } finally {
      loading.value = false
    }
  }
}
</script>

