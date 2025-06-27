<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to your Vue CMS dashboard!</p>
    
    <div class="user-info">
      <h2>User Information</h2>
      <div v-if="user">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>User ID:</strong> {{ user.id }}</p>
        <p><strong>Last Sign In:</strong> {{ formatDate(user.last_sign_in_at) }}</p>
      </div>
      <div v-else-if="loading">
        <p>Loading user information...</p>
      </div>
      <div v-else>
        <p>No user information available</p>
      </div>
    </div>

    <div class="actions">
      <button @click="signOut" class="btn btn-danger">Sign Out</button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const user = ref(null)
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  await loadUserInfo()
})

const loadUserInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    const response = await api.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value = response.data.user
  } catch (err) {
    console.error('Dashboard error:', err)
    
    // If token is invalid, redirect to signin
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/signin')
      return
    }
    
    error.value = 'Failed to load user information. Please try again.'
    
    // Clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const signOut = () => {
  localStorage.removeItem('token')
  router.push('/signin')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.user-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.user-info h2 {
  color: #333;
  margin-bottom: 15px;
}

.user-info p {
  margin: 10px 0;
}

.actions {
  margin: 20px 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.error-message {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
}
</style> 