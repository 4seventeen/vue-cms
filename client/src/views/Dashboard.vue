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

    <Card title="Your Cases">
      <div v-if="casesLoading" class="loading-state">
        <p>Loading cases...</p>
      </div>
      <div v-else-if="cases.length === 0" class="no-cases">
        <p>No cases found. <router-link to="/file-complaint">File your first complaint</router-link></p>
      </div>
      <div v-else class="cases-grid">
        <CaseCard
          v-for="caseItem in cases"
          :key="caseItem.id"
          :case-data="caseItem"
          @click="viewCase(caseItem.id)"
        >
          <template #actions>
            <div class="case-actions">
              <Button variant="primary" size="small" @click.stop="viewCase(caseItem.id)">
                View Details
              </Button>
              <Button variant="secondary" size="small" @click.stop="editCase(caseItem.id)">
                Edit
              </Button>
            </div>
          </template>
        </CaseCard>
      </div>
    </Card>

    <div class="actions">
      <Button variant="success" @click="$router.push('/file-complaint')">
        File New Complaint
      </Button>
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
import { getAllCases } from '../services/caseService.js'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import CaseCard from '../components/case/CaseCard.vue'

const router = useRouter()
const user = ref(null)
const cases = ref([])
const error = ref('')
const loading = ref(true)
const casesLoading = ref(true)

onMounted(async () => {
  await Promise.all([loadUserInfo(), loadCases()])
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

const loadCases = async () => {
  try {
    const response = await getAllCases()
    cases.value = response.cases || []
  } catch (err) {
    console.error('Error loading cases:', err)
    error.value = 'Failed to load cases. Please try again.'
    
    // Clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    casesLoading.value = false
  }
}

const viewCase = (caseId) => {
  router.push(`/case/${caseId}`)
}

const editCase = (caseId) => {
  router.push(`/case/${caseId}/edit`)
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
  max-width: 1200px;
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

.loading-state, .no-data, .no-cases {
  text-align: center;
  color: #666;
  padding: 20px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.case-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.actions {
  margin: 20px 0;
  display: flex;
  gap: 15px;
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

.no-cases a {
  color: #007bff;
  text-decoration: none;
}

.no-cases a:hover {
  text-decoration: underline;
}
</style> 