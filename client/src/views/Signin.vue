<template>
  <div class="signin">
    <h1>Sign In</h1>
    <form @submit.prevent="handleSignin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required :disabled="loading" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required :disabled="loading" />
      </div>
      <button type="submit" :disabled="loading">
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign In</span>
      </button>
    </form>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="success" class="success-message">
      {{ success }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const clearMessages = () => {
  error.value = ''
  success.value = ''
}

const handleSignin = async () => {
  clearMessages()
  loading.value = true
  
  try {
    const response = await api.post('/api/signin', {
      email: email.value,
      password: password.value
    })
    
    success.value = 'Sign in successful! Redirecting...'
    
    // Store the Supabase session token
    if (response.data.session?.access_token) {
      localStorage.setItem('token', response.data.session.access_token)
      
      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      error.value = 'No session token received'
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Sign in failed'
    error.value = errorMessage
    
    // Clear error after 5 seconds
    setTimeout(() => {
      if (error.value === errorMessage) {
        error.value = ''
      }
    }, 5000)
  } finally {
    loading.value = false
  }
}

// Clear error when user starts typing
const clearErrorOnInput = () => {
  if (error.value) {
    error.value = ''
  }
}
</script>

<style scoped>
.signin {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

.error-message {
  color: #721c24;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}

.success-message {
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  text-align: center;
}
</style>