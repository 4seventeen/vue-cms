<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card style="min-width: 500px; min-height: 350px;">
            <v-card-title class="text-center">
              <h1>Dashboard</h1>
            </v-card-title>
            <v-card-text>
              <div v-if="user" class="text-center">
                <h2>Welcome, {{ user.username }}!</h2>
                <p class="mt-4">You are successfully logged in.</p>
                <v-btn 
                  color="error" 
                  @click="logout" 
                  class="mt-4"
                >
                  Logout
                </v-btn>
              </div>
              <div v-else class="text-center">
                <p>Loading user information...</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/axios'

export default {
  name: "Dashboard",
  setup() {
    const router = useRouter()
    const user = ref(null)

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    }

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/signin')
          return
        }

        const response = await api.get('/me')
        user.value = response.data.user
      } catch (error) {
        console.error('Error fetching user info:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/signin')
      }
    }

    onMounted(() => {
      // Try to get user from localStorage first
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      
      // Then fetch fresh data from server
      fetchUserInfo()
    })

    return {
      user,
      logout
    }
  }
}
</script>

<style scoped>
h1 {
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
}

h2 {
  color: #666;
  font-size: 1.5em;
}
</style>