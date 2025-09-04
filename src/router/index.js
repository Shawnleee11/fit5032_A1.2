// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Catalogue from '../pages/Catalogue.vue'
import AddItem from '../pages/AddItem.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import { isLoggedIn } from '../auth'

const routes = [
  { path: '/', component: Catalogue, name: 'catalogue' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  // protect "Add" behind login
  { path: '/add', component: AddItem, name: 'add', meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
