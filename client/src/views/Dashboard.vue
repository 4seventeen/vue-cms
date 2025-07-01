<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to your Vue CMS dashboard!</p>
    
    <Card title="User Information">
      <div v-if="user" class="user-info">
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ user.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">User ID:</span>
          <span class="info-value">{{ user.id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Last Sign In:</span>
          <span class="info-value">{{ formatDate(user.last_sign_in_at) }}</span>
        </div>
      </div>
      <div v-else-if="loading" class="loading-state">
        <p>Loading user information...</p>
      </div>
      <div v-else class="no-data">
        <p>No user information available</p>
      </div>
    </Card>

    <div class="actions">
      <Button variant="danger" @click="signOut">Sign Out</Button>
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
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'

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
  color: #334;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #333;
  min-width: 120px;
}

.info-value {
  color: #666;
  text-align: right;
}

.loading-state, .no-data {
  text-align: center;
  color: #666;
  padding: 20px;
}

.actions {
  margin: 20px 0;
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