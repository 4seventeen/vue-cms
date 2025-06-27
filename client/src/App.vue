<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

const checkAuthStatus = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

const signOut = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/signin')
}

onMounted(() => {
  checkAuthStatus()
})

// Watch for route changes to update auth status
watch(route, () => {
  checkAuthStatus()
})
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">Vue CMS</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link v-if="!isLoggedIn" to="/signin" class="nav-link">Sign In</router-link>
          <router-link v-if="!isLoggedIn" to="/signup" class="nav-link">Sign Up</router-link>
          <router-link v-if="isLoggedIn" to="/dashboard" class="nav-link">Dashboard</router-link>
          <button v-if="isLoggedIn" @click="signOut" class="nav-link signout-btn">Sign Out</button>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #333;
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-link:hover {
  background: #555;
  border-radius: 4px;
}

.signout-btn {
  color: #ff6b6b;
}

.signout-btn:hover {
  background: #ff6b6b;
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
