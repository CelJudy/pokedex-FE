import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import ConfirmEmail from './views/ConfirmEmail.vue'
import Pokedex from './views/Pokedex.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/confirm/:token',
    name: 'ConfirmEmail',
    component: ConfirmEmail
  },
  {
    path: '/pokedex',
    name: 'Pokedex',
    component: Pokedex,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if ((to.path === '/' || to.path === '/register') && isAuthenticated) {
    next('/pokedex')
  } else {
    next()
  }
})

createApp(App).use(router).mount('#app')

let db=window.indexedDB.open('database')

db.onupgradeneeded=event=>{
  let result=event.target.result;
  result.createObjectStore("table", {autoIncrement:true});
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('SW registration failed', err))
  })
}

