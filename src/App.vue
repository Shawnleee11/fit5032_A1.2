<template>
  <div>
    <!-- top nav -->
    <nav class="border-bottom mb-3" style="padding:12px;display:flex;gap:12px">
      <router-link to="/">Catalogue</router-link>

      <router-link to="/add" v-if="logged && isAdmin">Add</router-link>

      <span class="ms-auto"></span>
      <router-link v-if="!logged" to="/login">Login</router-link>
      <router-link v-if="!logged" to="/register">Register</router-link>
      <button v-if="logged" class="btn btn-sm btn-outline-secondary" @click="doLogout">Logout</button>
    </nav>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as auth from './auth'

const logged  = ref(auth.isLoggedIn())
const isAdmin = ref(auth.hasRole('admin'))

function refreshAuth () {
  logged.value  = auth.isLoggedIn()
  isAdmin.value = auth.hasRole('admin')
}

function doLogout () {
  auth.logout()
  refreshAuth()
}

onMounted(() => {
  // 登录/注册成功后，我们在 Login.vue / Register.vue 会 dispatch 这个事件
  window.addEventListener('a12-auth-changed', refreshAuth)
  // 跨标签页时也能同步
  window.addEventListener('storage', refreshAuth)
})
onBeforeUnmount(() => {
  window.removeEventListener('a12-auth-changed', refreshAuth)
  window.removeEventListener('storage', refreshAuth)
})
</script>

<style scoped>
.container { max-width:1000px; margin:16px auto; padding:0 12px }
a { color:#2563eb; text-decoration:none }
a.router-link-active { font-weight:700 }
</style>
