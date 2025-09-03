<script setup>
import { ref, computed, onMounted } from 'vue'
import seed from '../data/locations.js'

const STORAGE_KEY = 'a12_locations'
const list = ref([])

// load from localStorage first, fallback to seed
onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  list.value = raw ? JSON.parse(raw) : seed
})

const q = ref('')        // search keyword
const region = ref('')   // region filter
const sortBy = ref('name-asc')

// simple region list for Melbourne
const regions = ['Central','North','South','East','West','South-East']

// computed view
const dataView = computed(() => {
  const key = q.value.toLowerCase().trim()
  let out = list.value.filter(i => {
    const txt = `${i.country} ${i.city} ${i.region} ${i.blurb}`.toLowerCase()
    return (key ? txt.includes(key) : true) && (region.value ? i.region === region.value : true)
  })
  const [field, dir] = sortBy.value.split('-')
  out.sort((a,b)=>{
    const va = field==='beneficiaries' ? +a.beneficiaries : `${a.country} ${a.city}`.toLowerCase()
    const vb = field==='beneficiaries' ? +b.beneficiaries : `${b.country} ${b.city}`.toLowerCase()
    return dir==='asc' ? (va>vb?1:-1) : (va<vb?1:-1)
  })
  return out
})
</script>

<template>
  <section class="mt-3">
    <h2 class="mb-3">Where We Work in Melbourne</h2>

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

    <!-- Responsive grid: 1 col on xs, 2 on sm, 3 on lg, 4 on xxl -->
    <div class="row g-3">
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
