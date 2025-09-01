<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'a12_locations'

// 内部字段名沿用原来，显示名称改成 Suburb/LGA/Participants
const form = reactive({ country:'', city:'', region:'Central', beneficiaries:'', blurb:'' })
const errors = reactive({})

function validate(){
  errors.country = form.country.trim() ? '' : 'Suburb is required'
  errors.blurb = form.blurb.trim().length >= 10 ? '' : 'Description ≥ 10 chars'
  const n = Number(form.beneficiaries)
  errors.beneficiaries = n > 0 && Number.isFinite(n) ? '' : 'Participants > 0'
  return !Object.values(errors).some(Boolean)
}
const canSubmit = computed(()=>validate())

function onSubmit(e){
  e.preventDefault()
  if(!validate()) return
  const raw = localStorage.getItem(STORAGE_KEY)
  const list = raw ? JSON.parse(raw) : []
  const nextId = Math.max(0, ...list.map(i=>i.id||0)) + 1
  list.unshift({
    id: nextId,
    country: form.country.trim(),        // suburb
    city: form.city.trim(),              // LGA
    region: form.region,
    beneficiaries: Number(form.beneficiaries),
    blurb: form.blurb.trim()
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  router.push('/')
}
</script>

<template>
  <section>
    <h2>Add Melbourne Location</h2>
    <form @submit="onSubmit" class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
      <div>
        <label>Suburb</label>
        <input v-model.trim="form.country" placeholder="e.g. Brunswick" />
        <p v-if="errors.country" class="small" style="color:#dc2626">{{ errors.country }}</p>
      </div>
      <div>
        <label>LGA</label>
        <input v-model.trim="form.city" placeholder="e.g. Merri-bek" />
      </div>
      <div>
        <label>Region</label>
        <select v-model="form.region">
          <option>Central</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
          <option>South-East</option>
        </select>
      </div>
      <div>
        <label>Participants</label>
        <input v-model.number="form.beneficiaries" type="number" min="1" step="1" placeholder="e.g. 120" />
        <p v-if="errors.beneficiaries" class="small" style="color:#dc2626">{{ errors.beneficiaries }}</p>
      </div>
      <div style="grid-column:1/-1">
        <label>Description</label>
        <textarea v-model.trim="form.blurb" rows="4" placeholder="Short description (≥ 10 chars)"></textarea>
        <p v-if="errors.blurb" class="small" style="color:#dc2626">{{ errors.blurb }}</p>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button :disabled="!canSubmit">Save</button>
        <button type="button" @click="$router.push('/')">Cancel</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
label{display:block;margin-bottom:6px;color:#64748b;font-size:12px}
</style>
