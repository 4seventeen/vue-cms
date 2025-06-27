<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card width="400">
      <v-card-title>Sign Up</v-card-title>
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
          <v-btn type="submit" color="primary" :loading="loading" block>Sign Up</v-btn>
        </v-form>
        <v-alert v-if="message" :type="messageType" class="mt-3">{{ message }}</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
<<<<<<< Updated upstream:client/src/components/Signup.vue
import axios from 'axios'
=======
import api from '../services/api.js'
>>>>>>> Stashed changes:client/src/views/Signup.vue

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
    const res = await axios.post('http://localhost:3000/api/signup', {
      username: username.value,
      password: password.value,
    })
    message.value = res.data.message
    messageType.value = 'success'
    username.value = ''
    password.value = ''
  } catch (err) {
    message.value = err.response?.data?.error || 'Signup failed'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script> 