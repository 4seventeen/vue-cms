<template>
  <div class="signin">
    <Card title="Sign In">
      <form @submit.prevent="handleSignin">
        <FormInput
          v-model="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          :disabled="loading"
          :error="emailError"
        />
        
        <FormInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          :disabled="loading"
          :error="passwordError"
        />
        
        <Button
          type="submit"
          variant="primary"
          :loading="loading"
          loading-text="Signing in..."
        >
          Sign In
        </Button>
      </form>
    </Card>
    
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
import Card from '../components/common/Card.vue'
import FormInput from '../components/common/FormInput.vue'
import Button from '../components/common/Button.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')

const clearMessages = () => {
  error.value = ''
  success.value = ''
  emailError.value = ''
  passwordError.value = ''
}

const validateForm = () => {
  let isValid = true
  
  if (!email.value) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email'
    isValid = false
  }
  
  if (!password.value) {
    passwordError.value = 'Password is required'
    isValid = false
  }
  
  return isValid
}

const handleSignin = async () => {
  clearMessages()
  
  if (!validateForm()) {
    return
  }
  
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