<template>
  <div class="signup">
    <Card title="Sign Up">
      <form @submit.prevent="handleSignup">
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

        <FormInput
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          :disabled="loading"
          :error="confirmPasswordError"
        />

        <Button
          type="submit"
          variant="success"
          :loading="loading"
          loading-text="Creating account..."
        >
          Sign Up
        </Button>
      </form>
    </Card>

    <div class="signin-redirect">
      Already have an account?
      <router-link to="/signin" class="signin-link">Sign In</router-link>
    </div>
    
    
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
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const clearMessages = () => {
  error.value = ''
  success.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
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
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    isValid = false
  }
  
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

const handleSignup = async () => {
  clearMessages()
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    await api.post('/api/signup', {
      email: email.value,
      password: password.value
    })
    
    success.value = 'Account created successfully! Redirecting...'
    
    // Clear form
    email.value = ''
    password.value = ''
    confirmPassword.value = ''

    // Reset profile completion flag just in case
    localStorage.removeItem('profileCompleted')
    
    // Redirect after showing success message
    setTimeout(() => {
      router.push('/complete-profile')
    }, 2000)
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Sign up failed'
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
.signup {
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