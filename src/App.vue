<template>
  <div>
    <nav style="padding:12px;border-bottom:1px solid #eee;display:flex;gap:12px">
      <router-link to="/">Catalogue</router-link>
      <router-link to="/add">Add</router-link>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>
<script setup></script>
<style scoped>
.container{max-width:1000px;margin:16px auto;padding:0 12px}
a{color:#2563eb;text-decoration:none}
a.router-link-active{font-weight:700}
</style>
