<template>
  <div class="file-complaint">
    <h1>File a Complaint</h1>
    <p>Submit a new case with respondent information.</p>
    
    <Card title="Case Information">
      <form @submit.prevent="handleSubmit">
        <FormInput
          v-model="form.case_description"
          label="Case Description"
          type="textarea"
          placeholder="Describe your complaint in detail..."
          required
          :disabled="loading"
          :error="errors.case_description"
        />
        
        <FormInput
          v-model="form.respondent_name"
          label="Respondent Name"
          type="text"
          placeholder="Enter the respondent's full name"
          required
          :disabled="loading"
          :error="errors.respondent_name"
        />
        
        <FormInput
          v-model="form.respondent_address"
          label="Respondent Address"
          type="text"
          placeholder="Enter the respondent's address"
          required
          :disabled="loading"
          :error="errors.respondent_address"
        />
        
        <div class="form-actions">
          <Button
            type="submit"
            variant="success"
            :loading="loading"
            loading-text="Submitting..."
          >
            Submit Complaint
          </Button>
          <Button
            type="button"
            variant="secondary"
            @click="$router.push('/dashboard')"
            :disabled="loading"
          >
            Cancel
          </Button>
        </div>
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
import { createCase } from '../services/caseService.js'
import Card from '../components/common/Card.vue'
import FormInput from '../components/common/FormInput.vue'
import Button from '../components/common/Button.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  case_description: '',
  respondent_name: '',
  respondent_address: ''
})

const errors = ref({
  case_description: '',
  respondent_name: '',
  respondent_address: ''
})

const clearMessages = () => {
  error.value = ''
  success.value = ''
  errors.value = {
    case_description: '',
    respondent_name: '',
    respondent_address: ''
  }
}

const validateForm = () => {
  let isValid = true
  
  if (!form.value.case_description.trim()) {
    errors.value.case_description = 'Case description is required'
    isValid = false
  } else if (form.value.case_description.trim().length < 10) {
    errors.value.case_description = 'Case description must be at least 10 characters'
    isValid = false
  }
  
  if (!form.value.respondent_name.trim()) {
    errors.value.respondent_name = 'Respondent name is required'
    isValid = false
  }
  
  if (!form.value.respondent_address.trim()) {
    errors.value.respondent_address = 'Respondent address is required'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  clearMessages()
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const payload = {
      case_description: form.value.case_description.trim(),
      respondent_name: form.value.respondent_name.trim(),
      respondent_address: form.value.respondent_address.trim()
    }
    
    const response = await createCase(payload)
    
    success.value = 'Complaint submitted successfully! Redirecting to dashboard...'
    
    // Clear form
    form.value = {
      case_description: '',
      respondent_name: '',
      respondent_address: ''
    }
    
    // Redirect after showing success message
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Failed to submit complaint'
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
.file-complaint {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
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