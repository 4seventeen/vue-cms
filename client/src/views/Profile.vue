<template>
  <div class="profile">
    <h1>Profile</h1>
    <p>Manage your account information</p>
    
    <Card title="User Information">
      <template v-if="loading">
        <p>Loading user information...</p>
      </template>
      <template v-else-if="error">
        <p>{{ error }}</p>
      </template>
      <template v-else>
        <div class="user-info">
          <div class="info-row"><span class="info-label">Email:</span><span class="info-value">{{ user.email }}</span></div>
          <div class="info-row"><span class="info-label">User ID:</span><span class="info-value">{{ user.id }}</span></div>
          <div class="info-row"><span class="info-label">First Name:</span><span class="info-value">{{ profile?.first_name }}</span></div>
          <div class="info-row"><span class="info-label">Middle Name:</span><span class="info-value">{{ profile?.middle_name || '—' }}</span></div>
          <div class="info-row"><span class="info-label">Last Name:</span><span class="info-value">{{ profile?.last_name }}</span></div>
          <div class="info-row"><span class="info-label">Suffix:</span><span class="info-value">{{ profile?.suffix || '—' }}</span></div>
          <div class="info-row"><span class="info-label">Sex:</span><span class="info-value">{{ profile?.sex }}</span></div>
          <div class="info-row"><span class="info-label">Date of Birth:</span><span class="info-value">{{ profile?.date_of_birth }}</span></div>
          <div class="info-row"><span class="info-label">Phone:</span><span class="info-value">{{ profile?.phone }}</span></div>
          <div class="info-row"><span class="info-label">Country:</span><span class="info-value">{{ profile?.country }}</span></div>
          <div class="info-row"><span class="info-label">Province:</span><span class="info-value">{{ profile?.province }}</span></div>
          <div class="info-row"><span class="info-label">City:</span><span class="info-value">{{ profile?.city }}</span></div>
          <div class="info-row"><span class="info-label">Barangay:</span><span class="info-value">{{ profile?.barangay }}</span></div>
          <div class="info-row"><span class="info-label">Sitio/Purok/Subd.:</span><span class="info-value">{{ profile?.sitio_purok_subdivision || '—' }}</span></div>
          <div class="info-row"><span class="info-label">House & Street:</span><span class="info-value">{{ profile?.house_street || '—' }}</span></div>
          <div class="info-row"><span class="info-label">Account Created:</span><span class="info-value">{{ formatDate(user.created_at) }}</span></div>
        </div>
      </template>
    </Card>

    <div class="actions">
      <Button variant="primary" @click="$router.push('/dashboard')">
        Back to Dashboard
      </Button>
      <Button variant="secondary" @click="$router.push('/edit-profile')">Edit Profile</Button>
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
import { supabase } from '../services/supabaseClient.js'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'

const router = useRouter()
const user = ref(null)
const profile = ref(null)
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  await loadUserInfo()
})

const loadUserInfo = async () => {
  try {
    // supabase-js v2 automatically sends stored token
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) {
      throw new Error(userErr?.message || 'Failed to fetch auth user')
    }
    user.value = userRes.user

    // Fetch profile row
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .maybeSingle()

    if (profileErr) {
      throw new Error(profileErr.message)
    }
    if (!profileData) {
      // No profile yet – force user to complete it
      router.push('/complete-profile')
      return
    }
    profile.value = profileData
  } catch (err) {
    console.error('Profile error:', err)
    // If token is invalid, redirect to signin
    if (err.message?.includes('JWT') || err.message?.includes('token')) {
      localStorage.removeItem('token')
      router.push('/signin')
      return
    }
    error.value = 'Failed to load user information. Please try again.'
    setTimeout(() => (error.value = ''), 5000)
  } finally {
    loading.value = false
  }
}

const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/signin')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.profile {
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
</style> 