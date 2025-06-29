<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Vue CMS</router-link>
      <div class="nav-links">

        
        <!-- Unauthenticated links -->
        <template v-if="!isLoggedIn">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/signin" class="nav-link">Sign In</router-link>
          <router-link to="/signup" class="nav-link">Sign Up</router-link>
        </template>
        
        <!-- Authenticated links -->
        <template v-else>
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
          <router-link to="/file-complaint" class="nav-link">File Complaint</router-link>
          <button @click="handleSignOut" class="nav-link signout-btn">Sign Out</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['sign-out'])

const handleSignOut = () => {
  emit('sign-out')
}
</script>

<style scoped>
.navbar {
  background: #333;
  padding: 1rem 0;
  width: 1200px;
  height: 100%;
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
</style> 