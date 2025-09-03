<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import seed from '../data/locations.js'

const STORAGE_KEY = 'a12_locations'
const list = ref([])

const route = useRoute()
const router = useRouter()
const showSaved = ref(false)

// load from localStorage first, fallback to seed; show success alert if coming from Add
onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  list.value = raw ? JSON.parse(raw) : seed

  if (route.query.saved) {
    showSaved.value = true
    setTimeout(() => {
      showSaved.value = false
      const q = { ...route.query }
      delete q.saved
      router.replace({ query: q })
    }, 2500)
  }
})

const q = ref('')        
const region = ref('')   
const sortBy = ref('name-asc')

// simple region list for Melbourne
const regions = ['Central','North','South','East','West','South-East']

// computed view: filter , sort
const dataView = computed(() => {
  const key = q.value.toLowerCase().trim()
  let out = list.value.filter(i => {
    const txt = `${i.country} ${i.city} ${i.region} ${i.blurb}`.toLowerCase()
    return (key ? txt.includes(key) : true) && (region.value ? i.region === region.value : true)
  })
  const [field, dir] = sortBy.value.split('-')
  out.sort((a,b) => {
    const va = field === 'beneficiaries' ? +a.beneficiaries : `${a.country} ${a.city}`.toLowerCase()
    const vb = field === 'beneficiaries' ? +b.beneficiaries : `${b.country} ${b.city}`.toLowerCase()
    return dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
  })
  return out
})
</script>

<template>
  <section class="mt-3">
    <h2 class="mb-3">Where We Work in Melbourne</h2>

    <!-- success alert after saving -->
    <div v-if="showSaved" class="alert alert-success" role="alert" aria-live="polite">
      Location saved successfully.
    </div>

    <!-- stats summary -->
    <p class="text-muted small mb-3">
      Showing {{ dataView.length }} locations · Total participants
      {{ dataView.reduce((sum, i) => sum + i.beneficiaries, 0) }}
    </p>

    <!-- filter controls -->
    <div class="row g-2 mb-3">
      <div class="col-12 col-md-6">
        <input v-model="q" class="form-control" placeholder="Search suburb / LGA / region" />
      </div>
      <div class="col-6 col-md-3">
        <select v-model="region" class="form-select">
          <option value="">All regions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
      <div class="col-6 col-md-3">
        <select v-model="sortBy" class="form-select">
          <option value="name-asc">Name ↑</option>
          <option value="name-desc">Name ↓</option>
          <option value="beneficiaries-desc">Participants ↓</option>
          <option value="beneficiaries-asc">Participants ↑</option>
        </select>
      </div>
    </div>

    <!-- empty state -->
    <div v-if="dataView.length === 0" class="alert alert-warning" role="status" aria-live="polite">
      No results match your filters.
    </div>

    <!-- Responsive grid: 1 col on xs, 2 on sm, 3 on lg, 4 on xxl -->
    <div v-else class="row g-3">
      <div class="col-12 col-sm-6 col-lg-4 col-xxl-3" v-for="it in dataView" :key="it.id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title mb-1">
              {{ it.country }} <span v-if="it.city" class="text-muted">· {{ it.city }}</span>
            </h5>
            <p class="card-subtitle text-muted mb-2">
              {{ it.region }} · Participants: {{ it.beneficiaries }}
            </p>
            <p class="card-text small">{{ it.blurb }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
