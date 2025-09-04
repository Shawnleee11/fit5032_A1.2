<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import seed from '../data/locations.js'

const STORAGE_KEY = 'a12_locations'
const list = ref([])

const route = useRoute()
const router = useRouter()
const showSaved = ref(false)

// filters
const q = ref('')
const region = ref('ALL')
const sortKey = ref('name')   
const sortDir = ref('asc')   
// load data 
onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  list.value = raw
    ? JSON.parse(raw)
    : seed.map(it => ({ ...it, ratings: it.ratings || [] }))

  // small toast after Add 
  if (route.query.saved) {
    showSaved.value = true
    setTimeout(() => (showSaved.value = false), 1600)
    router.replace({ query: {} })
  }
})

// handy: write current list back
function persist () {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value))
}

// unique regions for the dropdown
const regions = computed(() => {
  const s = new Set(list.value.map(i => i.region).filter(Boolean))
  return ['ALL', ...Array.from(s).sort()]
})

// text filter + region filter
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return list.value.filter(it => {
    const okRegion = region.value === 'ALL' || it.region === region.value
    const hay = [it.country, it.city, it.region, it.blurb].join(' ').toLowerCase()
    const okSearch = !term || hay.includes(term)
    return okRegion && okSearch
  })
})

// sort by name or by participants
const shown = computed(() => {
  const arr = [...filtered.value]
  arr.sort((a, b) => {
    let A, B
    if (sortKey.value === 'participants') {
      A = Number(a.beneficiaries) || 0
      B = Number(b.beneficiaries) || 0
    } else {
      A = (a.country || '').toLowerCase()
      B = (b.country || '').toLowerCase()
    }
    const cmp = A < B ? -1 : A > B ? 1 : 0
    return sortDir.value === 'asc' ? cmp : -cmp
  })
  return arr
})

// top line stats
const totalCount = computed(() => shown.value.length)
const totalParticipants = computed(() =>
  shown.value.reduce((s, it) => s + (Number(it.beneficiaries) || 0), 0)
)

// rating: push a score and save
function addRating (item, score) {
  const s = Math.max(1, Math.min(5, Number(score)))
  if (!item.ratings) item.ratings = []
  item.ratings.push(s)
  persist()
}

// average rating
function avg (arr) {
  if (!arr || !arr.length) return 0
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
}

// one-click: load demo seed into localStorage (handy during recording)
function loadDemo () {
  list.value = seed.map(it => ({ ...it, ratings: it.ratings || [] }))
  persist()
}
</script>

<template>
  <section class="mt-3">
    <div v-if="showSaved" class="alert alert-success">Saved. Back to list.</div>

    <h2 class="mb-2">Where We Work in Melbourne</h2>
    <p class="text-muted">
      Showing <strong>{{ totalCount }}</strong> locations ·
      Total participants <strong>{{ totalParticipants }}</strong>
    </p>

    <!-- controls -->
    <div class="row g-3 align-items-end mb-3">
      <div class="col-lg-5">
        <label class="form-label">Search suburb / LGA / region</label>
        <input class="form-control" v-model="q" placeholder="e.g. North, Box Hill, Yarra..." />
      </div>

      <div class="col-lg-3">
        <label class="form-label">Region</label>
        <select class="form-select" v-model="region">
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="col-lg-3">
        <label class="form-label">Sort</label>
        <div class="input-group">
          <select class="form-select" v-model="sortKey">
            <option value="name">Name</option>
            <option value="participants">Participants</option>
          </select>
          <button class="btn btn-outline-secondary"
                  @click="sortDir = (sortDir === 'asc' ? 'desc' : 'asc')">
            {{ sortDir === 'asc' ? '↑' : '↓' }}
          </button>
        </div>
      </div>

      <div class="col-lg-1 text-end">
        <button class="btn btn-outline-primary w-100" @click="loadDemo">Demo</button>
      </div>
    </div>

    <!-- cards -->
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <div class="col" v-for="it in shown" :key="it.id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title mb-1">
              {{ it.country }} <span v-if="it.city" class="text-muted">· {{ it.city }}</span>
            </h5>
            <p class="card-subtitle text-muted mb-2">
              {{ it.region }} · Participants: {{ it.beneficiaries }}
            </p>
            <p class="card-text small">{{ it.blurb }}</p>

            <!-- rating block -->
            <div class="d-flex align-items-center gap-2 mt-2">
              <strong>Rating:</strong> <span>{{ avg(it.ratings) }}</span>
            </div>
            <div class="d-flex gap-2 mt-2">
              <button class="btn btn-sm btn-outline-secondary" @click="addRating(it, 5)">5</button>
              <button class="btn btn-sm btn-outline-secondary" @click="addRating(it, 4)">4</button>
              <button class="btn btn-sm btn-outline-secondary" @click="addRating(it, 3)">3</button>
              <button class="btn btn-sm btn-outline-secondary" @click="addRating(it, 2)">2</button>
              <button class="btn btn-sm btn-outline-secondary" @click="addRating(it, 1)">1</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
