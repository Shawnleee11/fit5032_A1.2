
<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const STORAGE_KEY = 'a12_locations'

// Keep internal field names; such as Suburb/LGA/Participants
// Set region to empty 
const form = reactive({ country:'', city:'', region:'', beneficiaries:'', blurb:'' })
const errors = reactive({})

function validate(){
  // required text
  errors.country = form.country.trim() ? '' : 'Suburb is required'
  // required select
  errors.region = form.region ? '' : 'Region is required'
  // number > 0
  const n = Number(form.beneficiaries)
  errors.beneficiaries = n > 0 && Number.isFinite(n) ? '' : 'Participants > 0'
  // min length
  errors.blurb = form.blurb.trim().length >= 10 ? '' : 'Description ≥ 10 chars'

  return !Object.values(errors).some(Boolean)
}

// Re-evaluate on each render so the Save button reflects current validity
const canSubmit = computed(() => validate())

function onSubmit(e){
  e.preventDefault()
  if(!validate()) return

  const raw = localStorage.getItem(STORAGE_KEY)
  const list = raw ? JSON.parse(raw) : []
  const nextId = Math.max(0, ...list.map(i => i.id || 0)) + 1

  list.unshift({
    id: nextId,
    country: form.country.trim(),   // suburb
    city: form.city.trim(),         // LGA
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

    <!-- Use novalidate to avoid native popups -->
    <form @submit="onSubmit" novalidate class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
      <!-- Suburb -->
      <div>
        <label for="country" class="form-label">Suburb</label>
        <input
          id="country"
          type="text"
          v-model.trim="form.country"
          class="form-control"
          required
          placeholder="e.g. Brunswick"
          aria-describedby="countryHelp"
          :aria-invalid="!!errors.country"
          :class="{ 'is-invalid': !!errors.country }"
        />
        <div id="countryHelp" class="form-text">e.g. Brunswick</div>
        <div v-if="errors.country" class="invalid-feedback d-block">{{ errors.country }}</div>
      </div>

      <!-- LGA (optional) -->
      <div>
        <label for="city" class="form-label">LGA (optional)</label>
        <input
          id="city"
          type="text"
          v-model.trim="form.city"
          class="form-control"
          placeholder="e.g. Merri-bek"
        />
      </div>

      <!-- Region -->
      <div>
        <label for="region" class="form-label">Region</label>
        <select
          id="region"
          v-model="form.region"
          class="form-select"
          required
          :aria-invalid="!!errors.region"
          :class="{ 'is-invalid': !!errors.region }"
        >
          <option disabled value="">Select a region</option>
          <option>Central</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
          <option>South-East</option>
        </select>
        <div v-if="errors.region" class="invalid-feedback d-block">{{ errors.region }}</div>
      </div>

      <!-- Participants -->
      <div>
        <label for="beneficiaries" class="form-label">Participants</label>
        <input
          id="beneficiaries"
          type="number"
          v-model.number="form.beneficiaries"
          class="form-control"
          required
          min="1"
          max="10000"
          step="1"
          placeholder="e.g. 120"
          :aria-invalid="!!errors.beneficiaries"
          :class="{ 'is-invalid': !!errors.beneficiaries }"
        />
        <div v-if="errors.beneficiaries" class="invalid-feedback d-block">{{ errors.beneficiaries }}</div>
      </div>

      <!-- Description -->
      <div style="grid-column:1/-1">
        <label for="blurb" class="form-label">Description</label>
        <textarea
          id="blurb"
          v-model.trim="form.blurb"
          class="form-control"
          rows="4"
          required
          minlength="10"
          maxlength="200"
          placeholder="Short description (≥ 10 chars)"
          :aria-invalid="!!errors.blurb"
          :class="{ 'is-invalid': !!errors.blurb }"
        ></textarea>
        <div v-if="errors.blurb" class="invalid-feedback d-block">{{ errors.blurb }}</div>
      </div>

      <!-- Actions -->
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button :disabled="!canSubmit" :title="!canSubmit ? 'Please fix validation errors' : 'Save'">Save</button>
        <button type="button" @click="$router.push('/')">Cancel</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
label{display:block;margin-bottom:6px;color:#64748b;font-size:12px}
</style>