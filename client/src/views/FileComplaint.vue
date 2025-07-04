<template>
  <div class="file-complaint">
    <h1>File a Complaint</h1>
    <p>Submit your complaint details and supporting documents.</p>

    <Card>
      <form @submit.prevent="handleSubmit">
        <h2>Name of Respondent</h2>
        <div class="name-grid">
          <FormInput
            v-model="form.respondent_first_name"
            label="First Name"
            required
            :disabled="loading"
            :error="errors.respondent_first_name"
          />
          <FormInput
            v-model="form.respondent_middle_name"
            label="Middle Name (optional)"
            :disabled="loading"
            :error="errors.respondent_middle_name"
          />
          <FormInput
            v-model="form.respondent_last_name"
            label="Last Name"
            required
            :disabled="loading"
            :error="errors.respondent_last_name"
          />
          <FormInput
            v-model="form.respondent_suffix"
            label="Suffix"
            placeholder="e.g. Jr, Sr, III"
            :disabled="loading"
            :error="errors.respondent_suffix"
          />
        </div>

        <h2>Address</h2>
        <div class="address-grid">
          <FormInput
            v-model="form.respondent_sitio"
            label="Sitio/Purok/Subd."
            required
            :disabled="loading"
            :error="errors.respondent_sitio"
          />
          <FormInput
            v-model="form.respondent_house"
            label="House No. & Street"
            required
            :disabled="loading"
            :error="errors.respondent_house"
          />
        </div>

        <h2>Complaint Description</h2>
        <FormInput
          v-model="form.case_description"
          type="textarea"
          placeholder="Input Complaint Details Here"
          required
          :disabled="loading"
          :error="errors.case_description"
          :rows="6"
        />

        <h2>Upload Attachments <span class="text-muted">(optional)</span></h2>
        <div class="upload-box">
          <input type="file" multiple @change="handleFileChange" :disabled="loading" />
          <ul v-if="form.attachments.length">
            <li v-for="file in form.attachments" :key="file.name">{{ file.name }}</li>
          </ul>
        </div>

        <div class="form-actions">
          <Button
            type="submit"
            variant="success"
            :loading="loading"
            loading-text="Submitting..."
          >
            Proceed to Payment
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
import { supabase } from '../services/supabaseClient.js'
import Card from '../components/common/Card.vue'
import FormInput from '../components/common/FormInput.vue'
import Button from '../components/common/Button.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  respondent_first_name: '',
  respondent_middle_name: '',
  respondent_last_name: '',
  respondent_suffix: '',
  respondent_sitio: '',
  respondent_house: '',
  case_description: '',
  attachments: []
})

const errors = ref({
  respondent_first_name: '',
  respondent_middle_name: '',
  respondent_last_name: '',
  respondent_suffix: '',
  respondent_sitio: '',
  respondent_house: '',
  case_description: ''
})

const clearMessages = () => {
  error.value = ''
  success.value = ''
  Object.keys(errors.value).forEach(key => (errors.value[key] = ''))
}

const validateForm = () => {
  let isValid = true

  if (!form.value.respondent_first_name.trim()) {
    errors.value.respondent_first_name = 'First name is required'
    isValid = false
  }

  if (!form.value.respondent_last_name.trim()) {
    errors.value.respondent_last_name = 'Last name is required'
    isValid = false
  }

  if (!form.value.respondent_sitio.trim()) {
    errors.value.respondent_sitio = 'Sitio/Purok/Subd. is required'
    isValid = false
  }

  if (!form.value.respondent_house.trim()) {
    errors.value.respondent_house = 'House No. & Street is required'
    isValid = false
  }

  if (!form.value.case_description.trim()) {
    errors.value.case_description = 'Case description is required'
    isValid = false
  } else if (form.value.case_description.trim().length < 10) {
    errors.value.case_description = 'Case description must be at least 10 characters'
    isValid = false
  }

  return isValid
}

const handleFileChange = (e) => {
  form.value.attachments = Array.from(e.target.files)
}

const handleSubmit = async () => {
  clearMessages()

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    /* 1. Create the case first (without attachments) */
    const payload = {
      case_description: form.value.case_description.trim(),
      respondent_first_name: form.value.respondent_first_name.trim(),
      respondent_middle_name: form.value.respondent_middle_name.trim(),
      respondent_last_name: form.value.respondent_last_name.trim(),
      respondent_suffix: form.value.respondent_suffix.trim(),
      respondent_sitio: form.value.respondent_sitio.trim(),
      respondent_house: form.value.respondent_house.trim()
    }

    const response = await createCase(payload)
    const caseId = response?.case?.id

    /* 2. Upload attachments (if any) and create DB references under the user's RLS context */
    if (caseId && form.value.attachments.length) {
      // Get current session for uploaded_by value and auth check
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        throw new Error('User session expired. Please sign in again.')
      }

      for (const file of form.value.attachments) {
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 10)
        const filePath = `${caseId}/${timestamp}_${randomString}_${file.name}`

        // 1. Upload the file to the "attachments" storage bucket
        const { error: uploadErr } = await supabase
          .storage
          .from('case-attachments')
          .upload(filePath, file)
        if (uploadErr) throw uploadErr

        // 2. Insert row into case_attachments table
        const { error: insertErr } = await supabase
          .from('case_attachments')
          .insert({
            case_uuid: caseId,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: filePath,
            uploaded_by: session.user.id
          })
          .select()
          .single()
        
        if (insertErr) {
          console.error('Attachment insert error details:', insertErr)
          throw insertErr
        }
      }
    }

    success.value = 'Complaint submitted successfully! Redirecting to dashboard...'

    // Clear form
    form.value = {
      respondent_first_name: '',
      respondent_middle_name: '',
      respondent_last_name: '',
      respondent_suffix: '',
      respondent_sitio: '',
      respondent_house: '',
      case_description: '',
      attachments: []
    }

    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Failed to submit complaint'
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.file-complaint {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.name-grid,
.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.upload-box {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

.upload-box ul {
  margin-top: 10px;
  text-align: left;
}

.form-actions {
  margin-top: 25px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
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