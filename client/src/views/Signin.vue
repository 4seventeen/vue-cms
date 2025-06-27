<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card width="400">
      <v-card-title>Sign In</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-text-field
            v-model="username"
            label="Username"
            required
            :error-messages="usernameError"
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
            :error-messages="passwordError"
          />
          <v-btn type="submit" color="primary" :loading="loading" block>Sign In</v-btn>
        </v-form>
        <v-alert v-if="message" :type="messageType" class="mt-3">{{ message }}</v-alert>
        <div class="text-center mt-3">
          <router-link to="/signup">Don't have an account? Sign up</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const usernameError = ref('')
const passwordError = ref('')

const onSubmit = async () => {
  usernameError.value = ''
  passwordError.value = ''
  message.value = ''
  messageType.value = ''
  
  if (!username.value) {
    usernameError.value = 'Username is required'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }
  
  loading.value = true
  try {
    const res = await api.post('/signin', {
      username: username.value,
      password: password.value,
    })
    
    // Store token in localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    
    message.value = res.data.message
    messageType.value = 'success'
    
    // Redirect to dashboard after 1 second
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (err) {
    message.value = err.response?.data?.error || 'Signin failed'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>