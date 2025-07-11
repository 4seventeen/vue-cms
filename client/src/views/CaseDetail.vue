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
        <!-- DIV 1 – Complainant Overview -->
        <Card title="Case Overview">
          <div class="case-info">
            <div class="info-row">
              <span class="info-label">Case Type:</span>
              <!-- TODO: Replace static text when case_type enum is added -->
              <span class="info-value">{{ caseData.case_type || 'Theft and Robbery' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Respondent:</span>
              <span class="info-value">{{ respondentFullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Filed Date:</span>
              <span class="info-value">{{ formatDate(caseData.created_at) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Resolved Date:</span>
              <span class="info-value">{{ caseData.resolved_at ? formatDate(caseData.resolved_at) : '—' }}</span>
            </div>
          </div>
          <div class="case-description" style="margin-top: 15px;">
            <p>{{ caseData.case_description }}</p>
          </div>
        </Card>

        <!-- DIV 2 – Complainant Information -->
        <Card title="Complainant Information">
          <div class="complainant-info">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ complainantFullName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">{{ profile?.phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">{{ user?.email || '—' }}</span>
            </div>
            <div class="info-row" style="align-items: flex-start;">
              <span class="info-label">Address:</span>
              <span class="info-value" style="text-align: left;">{{ fullAddress }}</span>
            </div>
          </div>
        </Card>

        <!-- DIV 3 – Case Timeline -->
        <Card title="Case Timeline">
          <ul class="timeline">
            <li v-for="(event, idx) in timelineEvents" :key="idx" class="timeline-event">
              <div class="event-indicator"></div>
              <div class="event-details">
                <span class="event-title">{{ event.title }}</span>
                <span class="event-date">{{ formatDate(event.date) }}</span>
              </div>
            </li>
          </ul>
        </Card>

        <!-- DIV 4 – Attachments -->
        <Card title="Attachments">
          <template v-if="attachments && attachments.length">
            <ul class="attachments">
              <li v-for="file in attachments" :key="file.id" class="attachment-item">
                <div class="file-details">
                  <span class="file-name">{{ file.file_name }}</span>
                  <span class="file-type">({{ file.file_type || 'unknown type' }})</span>
                </div>
                <Button variant="secondary" size="small" @click="downloadFile(file)">Download</Button>
              </li>
            </ul>
          </template>
          <template v-else>
            <p>No attachments available.</p>
          </template>
        </Card>

        <!-- DIV 5 – Download Case Report Action -->
        <Card>
          <div class="actions" style="justify-content:center;">
            <Button variant="primary" @click="downloadReport" style="width: 220px;">
              Download Case Report
            </Button>
          </div>
        </Card>

        <!-- DIV 6 – Hearing Information (placeholder) -->
        <Card title="Hearing Information">
          <p>Hearing details will be shown here once available.</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCaseById } from '../services/caseService.js'
import Card from '../components/common/Card.vue'
import Button from '../components/common/Button.vue'
import { supabase } from '../services/supabaseClient.js'

// Additional reactive state for complainant and timeline
const user = ref(null)
const profile = ref(null)
const timelineEvents = ref([])

const route = useRoute()
const router = useRouter()
const caseData = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  await Promise.all([loadCase(), loadUserInfo()])
})

// Fetch complainant (authenticated user) info
const loadUserInfo = async () => {
  try {
    const { data: userRes, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userRes?.user) throw new Error(userErr?.message || 'Failed to fetch user')
    user.value = userRes.user

    // Fetch profile row
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.value.id)
      .maybeSingle()
    if (profileErr) throw new Error(profileErr.message)
    profile.value = profileData || null
  } catch (err) {
    console.error('Error loading complainant info:', err)
  }
}

const loadCase = async () => {
  try {
    const caseId = route.params.id
    const response = await getCaseById(caseId)
    caseData.value = response.case

    // Build basic timeline once we have the case data
    timelineEvents.value = [
      { title: 'Case filed', date: response.case.created_at },
      { title: 'Case accessed', date: new Date().toISOString() },
      // Placeholder events – to be replaced with real log data
      { title: 'Hearing conducted', date: response.case.hearing_date || null },
      { title: 'Case resolved', date: response.case.resolved_at || null }
    ].filter(e => e.date)
  } catch (err) {
    console.error('Error loading case:', err)
    if (err.response?.status === 404) {
      error.value = 'Case not found'
    } else if (err.response?.status === 401) {
      error.value = 'You are not authorized to view this case'
    } else {
      error.value = 'Failed to load case details. Please try again.'
    }
    setTimeout(() => (error.value = ''), 10000)
  } finally {
    loading.value = false
  }
}

const editCase = () => {
  if (!caseData.value) return
  router.push(`/case/${caseData.value.id}/edit`)
}

const downloadReport = () => {
  // TODO: implement once backend report generation is available
  alert('Download functionality coming soon!')
}

const downloadFile = async (file) => {
  if (!file?.storage_path) return

  const bucket = 'case-attachments'

  try {
    // Generate a short-lived signed URL (60 s)
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(file.storage_path, 60)

    if (error || !data?.signedUrl) throw error || new Error('Missing signed URL')

    const url = data.signedUrl

    // Open preview in a new tab
    window.open(url, '_blank')

    // Auto-trigger file download with the original file name
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.download = file.file_name || ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Failed to download attachment:', err)
    alert('Failed to download attachment. Please try again.')
  }
}

// Derived/computed properties
const complainantFullName = computed(() => {
  if (!profile.value) return '—'
  return [profile.value.first_name, profile.value.middle_name, profile.value.last_name, profile.value.suffix]
    .filter(Boolean)
    .join(' ')
})

const fullAddress = computed(() => {
  if (!profile.value) return '—'
  const parts = [
    profile.value.house_street,
    profile.value.sitio_purok_subdivision,
    profile.value.barangay,
    profile.value.city,
    profile.value.province,
    profile.value.country
  ].filter(Boolean)
  return parts.join(', ')
})

/* Respondent full name using new schema */
const respondentFullName = computed(() => {
  if (!caseData.value?.respondents?.length) return '—'
  const r = caseData.value.respondents[0]
  return [r.first_name, r.middle_name, r.last_name, r.suffix].filter(Boolean).join(' ')
})

const attachments = computed(() => caseData.value?.attachments || [])

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

.complainant-info {
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

/* Timeline styles */
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline-event {
  display: flex;
  align-items: flex-start;
  position: relative;
  margin-bottom: 15px;
}

.event-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0d6efd;
  margin-right: 12px;
  margin-top: 6px;
}

.event-details {
  display: flex;
  flex-direction: column;
}

.event-title {
  font-weight: 600;
  color: #333;
}

.event-date {
  font-size: 0.85rem;
  color: #666;
}

/* Attachments styles */
.attachments {
  list-style: none;
  margin: 0;
  padding: 0;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.attachment-item:last-child {
  border-bottom: none;
}

.file-details {
  display: flex;
  gap: 8px;
  align-items: center;
  overflow: hidden;
}

.file-name {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
}

.file-type {
  font-size: 0.85rem;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
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