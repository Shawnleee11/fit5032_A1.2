<!-- src/pages/Register.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../auth'

const form = ref({ email: '', password: '', confirm: '' })
const err = ref({})

function validate () {
  err.value = {}
  if (!form.value.email) {
    err.value.email = 'Email is required'
  } else if (!/^[^@]+@student\.monash\.edu$/.test(form.value.email)) {
    err.value.email = 'Use your @student.monash.edu address'
  }
  if (!form.value.password || form.value.password.length < 8) {
    err.value.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(form.value.password)) {
    err.value.password = 'Password must include at least one capital letter'
  }
  if (form.value.password !== form.value.confirm) {
    err.value.confirm = 'Passwords do not match'
  }
  return Object.keys(err.value).length === 0
}

const router = useRouter()
function onSubmit (e) {
  e.preventDefault()
  if (!validate()) return

  const KEY = 'a12_users'
  const users = JSON.parse(localStorage.getItem(KEY) || '[]')
  const exists = users.find(u => u.email === form.value.email)
  if (exists) {
    err.value.email = 'Email already registered'
    return
  }

  // save new user
  users.push({ email: form.value.email, password: form.value.password })
  localStorage.setItem(KEY, JSON.stringify(users))

  // auto login after register (default: user role)
  login(form.value.email, 'user')
  window.dispatchEvent(new Event('a12-auth-changed'))
  router.replace('/')
}
</script>

<template>
  <section class="mt-4" style="max-width:560px">
    <h2>Create account</h2>
    <form @submit="onSubmit" class="mt-3">
      <div class="mb-3">
        <label class="form-label" for="remail">Email</label>
        <input
          id="remail"
          v-model="form.email"
          type="email"
          class="form-control"
          required
          placeholder="you@student.monash.edu"
        />
        <div class="text-danger small" v-if="err.email">{{ err.email }}</div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="rpass">Password</label>
          <input
            id="rpass"
            v-model="form.password"
            type="password"
            class="form-control"
            required
          />
          <div class="text-danger small" v-if="err.password">{{ err.password }}</div>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="rconfirm">Confirm</label>
          <input
            id="rconfirm"
            v-model="form.confirm"
            type="password"
            class="form-control"
            required
          />
          <div class="text-danger small" v-if="err.confirm">{{ err.confirm }}</div>
        </div>
      </div>

      <button class="btn btn-success mt-3">Register</button>
    </form>
  </section>
</template>

<style scoped>
h2 { font-weight: 700; }
</style>
