<script setup>
import { ref, computed, onMounted } from 'vue'
import seed from '../data/locations.js'

const STORAGE_KEY = 'a12_locations'
const list = ref([])

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  list.value = raw ? JSON.parse(raw) : seed
})

const q = ref(''), region = ref(''), sortBy = ref('name-asc')
// 墨尔本分区
const regions = ['Central','North','South','East','West','South-East']

const dataView = computed(() => {
  const key = q.value.toLowerCase().trim()
  let out = list.value.filter(i => {
    const txt = `${i.country} ${i.city} ${i.region} ${i.blurb}`.toLowerCase()
    const hit = key ? txt.includes(key) : true
    const r = region.value ? i.region === region.value : true
    return hit && r
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
  <section>
    <h2>Where We Work in Melbourne</h2>

    <div class="controls">
      <input v-model="q" placeholder="Search suburb / LGA / region" />
      <select v-model="region">
        <option value="">All regions</option>
        <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-model="sortBy">
        <option value="name-asc">Name ↑</option>
        <option value="name-desc">Name ↓</option>
        <option value="beneficiaries-desc">Participants ↓</option>
        <option value="beneficiaries-asc">Participants ↑</option>
      </select>
    </div>

    <div class="grid">
      <article v-for="it in dataView" :key="it.id" class="card">
        <!-- Suburb · LGA -->
        <h3>{{ it.country }} <span v-if="it.city">· {{ it.city }}</span></h3>
        <p class="small">{{ it.region }} · Participants: {{ it.beneficiaries }}</p>
        <p class="small">{{ it.blurb }}</p>
      </article>
    </div>
  </section>
</template>
