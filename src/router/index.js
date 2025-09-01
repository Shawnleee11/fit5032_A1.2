import { createRouter, createWebHistory } from 'vue-router'
import Catalogue from '../pages/Catalogue.vue'
import AddItem from '../pages/AddItem.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Catalogue },
    { path: '/add', component: AddItem },
  ],
})
