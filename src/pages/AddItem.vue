<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { clean } from '../utils'

const router = useRouter()
const STORAGE_KEY = 'a12_locations'


const form = reactive({ country:'', city:'', region:'', beneficiaries:'', blurb:'' })
const errors = reactive({})

function validate(){

  Object.keys(errors).forEach(k => delete errors[k])
  if(!form.country) errors.country = 'Suburb is required'
  if(!form.region) errors.region = 'LGA is required'
  if(!form.beneficiaries || isNaN(+form.beneficiaries) || +form.beneficiaries <= 0)
    errors.beneficiaries = 'Enter a number > 0'
  if(!form.blurb || form.blurb.length < 10)
    errors.blurb = 'Tell us a little bit more'
  return Object.keys(errors).length === 0
}

function onSubmit(e){
  e.preventDefault()
  if(!validate()) return
  const raw = localStorage.getItem(STORAGE_KEY)
  const list = raw ? JSON.parse(raw) : []
  list.push({
    id: Date.now(),
    country: clean(form.country),
    city: clean(form.city),
    region: clean(form.region),
    beneficiaries: +form.beneficiaries,
    blurb: clean(form.blurb),
    ratings: []
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  router.push({ name:'catalogue', query:{ saved:'1' } })
}

const canSubmit = computed(() => validate())
</script>

<template>
  <section class="mt-4">
    <h2>Add a program</h2>

    <form @submit="onSubmit" class="mt-3">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Suburb</label>
          <input class="form-control" v-model.trim="form.country" placeholder="e.g. Brunswick"/>
          <div class="text-danger small" v-if="errors.country">{{ errors.country }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">City / Council</label>
          <input class="form-control" v-model.trim="form.city" placeholder="e.g. Merri-bek"/>
        </div>

        <div class="col-md-6">
          <label class="form-label">LGA / Region</label>
          <input class="form-control" v-model.trim="form.region" />
          <div class="text-danger small" v-if="errors.region">{{ errors.region }}</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Participants</label>
          <input class="form-control" v-model.number="form.beneficiaries" type="number" min="1" />
          <div class="text-danger small" v-if="errors.beneficiaries">{{ errors.beneficiaries }}</div>
        </div>

        <div class="col-12">
          <label class="form-label">Short blurb</label>
          <textarea class="form-control" rows="3" v-model.trim="form.blurb"></textarea>
          <div class="text-danger small" v-if="errors.blurb">{{ errors.blurb }}</div>
        </div>
      </div>

      <button class="btn btn-primary mt-3" :disabled="!canSubmit">Save</button>
    </form>
  </section>
</template>
