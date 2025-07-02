<template>
  <div class="case-detail">
    <div v-if="loading" class="loading-state">
      <p>Loading case details...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <Button variant="primary" @click="$router.push('/dashboard')">
        Back to Dashboard
      </Button>
    </div>
    
    <div v-else-if="caseData" class="case-content">
      <div class="case-header">
        <h1>Case Details</h1>
        <div class="case-actions">
          <Button variant="secondary" @click="$router.push('/dashboard')">
            Back to Dashboard
          </Button>
          <Button variant="primary" @click="editCase">
            Edit Case
          </Button>
        </div>
      </div>
      
      <div class="case-grid">
        <Card title="Case Information">
          <div class="case-info">
            <div class="info-row">
              <span class="info-label">Case ID:</span>
              <span class="info-value">{{ caseData.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">
                <CaseStatus :status="caseData.status || 'open'" />
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Created:</span>
              <span class="info-value">{{ formatDate(caseData.created_at) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last Updated:</span>
              <span class="info-value">{{ formatDate(caseData.updated_at) }}</span>
            </div>
          </div>
        </Card>
        
        <Card title="Case Description">
          <div class="case-description">
            <p>{{ caseData.case_description }}</p>
          </div>
        </Card>
        
        <Card title="Respondent Information">
          <div v-if="caseData.respondents && caseData.respondents.length > 0" class="respondent-info">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ caseData.respondents[0].full_name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">{{ caseData.respondents[0].address }}</span>
            </div>
          </div>
          <div v-else class="no-respondent">
            <p>No respondent information available</p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCaseById } from '../services/caseService.js'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import CaseStatus from '../components/case/CaseStatus.vue'

const route = useRoute()
const router = useRouter()
const caseData = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await loadCase()
})

const loadCase = async () => {
  try {
    const caseId = route.params.id
    const response = await getCaseById(caseId)
    caseData.value = response.case
  } catch (err) {
    console.error('Error loading case:', err)
    
    if (err.response?.status === 404) {
      error.value = 'Case not found'
    } else if (err.response?.status === 401) {
      error.value = 'You are not authorized to view this case'
    } else {
      error.value = 'Failed to load case details. Please try again.'
    }
    
    // Clear error after 10 seconds
    setTimeout(() => {
      if (error.value) {
        error.value = ''
      }
    }, 10000)
  } finally {
    loading.value = false
  }
}

const editCase = () => {
  router.push(`/case/${caseData.value.id}/edit`)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.case-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-state {
  color: #721c24;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.case-header h1 {
  color: #333;
  margin: 0;
}

.case-actions {
  display: flex;
  gap: 15px;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.case-info, .respondent-info {
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
  flex: 1;
}

.case-description p {
  color: #333;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.no-respondent {
  text-align: center;
  color: #666;
  padding: 20px;
}

@media (max-width: 768px) {
  .case-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .case-grid {
    grid-template-columns: 1fr;
  }
}
</style> 