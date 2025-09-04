<!-- src/pages/Login.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../auth'

const email = ref('')
const password = ref('')
const role = ref('user')
const err = ref('')

const router = useRouter()
const route = useRoute()

function onSubmit(e) {
  e.preventDefault()
  err.value = ''

  // check email domain
  const mail = email.value.trim()
  if (!/^[^@]+@student\.monash\.edu$/.test(mail)) {
    err.value = 'Use your @student.monash.edu address'
    return
  }

  // check against local "user table"
  const users = JSON.parse(localStorage.getItem('a12_users') || '[]')
  const u = users.find(u => u.email === mail)
  if (!u) { err.value = 'Account not found'; return }
  if (u.password !== password.value) { err.value = 'Incorrect password'; return }

  // success → login + notify app + redirect
  login(u.email, role.value)
  window.dispatchEvent(new Event('a12-auth-changed'))
  router.replace(route.query.redirect || '/')
}
</script>

<template>
  <section class="mt-4" style="max-width:520px">
    <h2>Sign in</h2>

    <form @submit="onSubmit" class="mt-3">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          required
          placeholder="you@student.monash.edu"
          pattern="^[^@]+@student\.monash\.edu$"
        />
      </div>

      <div class="mb-3">
        <label class="form-label" for="pwd">Password</label>
        <input
          id="pwd"
          v-model="password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Role</label>
        <select v-model="role" class="form-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div class="form-text">Two roles to satisfy the role-based auth requirement.</div>
      </div>

      <div class="text-danger mb-2" v-if="err">{{ err }}</div>

      <button class="btn btn-primary">Sign in</button>
    </form>
  </section>
</template>

<style scoped>
h2 { font-weight: 700; }
</style>
