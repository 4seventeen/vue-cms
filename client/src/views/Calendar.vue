<template>
  <div class="calendar-page max-w-5xl mx-auto py-8">
    <!-- Header with month navigation -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <button @click="goPrev" class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">
          ←
        </button>
        <h2 class="text-xl font-semibold">
          {{ formatMonthYear(focusedDate) }}
        </h2>
        <button @click="goNext" class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300">
          →
        </button>
      </div>
      <Button variant="success" @click="showAddEvent = true">Add Event</Button>
    </div>

    <!-- Calendar -->
    <v-calendar
      :model-value="focusedDate"
      is-expanded
      :attributes="calendarAttributes"
      @update:model-value="focusedDate = $event"
      @dayclick="handleDayClick"
      @click:event="handleEventClick"
      :weekdays="[0,1,2,3,4,5,6]"
      :min-weeks="5"
      :show-weeknumbers="false"
    />

    <!-- Add Event Modal -->
    <div v-if="showAddEvent" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add Event</h3>
        <form @submit.prevent="createEvent" class="space-y-4">
          <FormInput v-model="newEvent.title" label="Title" required :error="errors.title" />
          <FormInput v-model="newEvent.description" label="Description" />
          <div>
            <label class="input-label block mb-1">Date <span class="text-red-500">*</span></label>
            <input type="date" v-model="newEvent.date" class="input-base w-full" />
            <span v-if="errors.date" class="error-text">{{ errors.date }}</span>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" @click="resetModal">Cancel</Button>
            <Button type="submit" variant="primary" :loading="saving" loading-text="Saving...">Save</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../services/supabaseClient.js'
import { format } from 'date-fns'
import Button from '../components/common/Button.vue'
import FormInput from '../components/common/FormInput.vue'

// Reactive state
const focusedDate = ref(new Date())
const events = ref([]) // raw events from supabase
const calendarAttributes = ref([]) // mapped for v-calendar

const showAddEvent = ref(false)
const saving = ref(false)
const errors = ref({})

const newEvent = ref({
  title: '',
  description: '',
  date: ''
})

// Fetch events on mount
onMounted(fetchEvents)

async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch events:', error)
    return
  }
  events.value = data || []
  mapEventsToAttributes()
}

function mapEventsToAttributes() {
  calendarAttributes.value = events.value.map(e => ({
    key: e.id,
    highlight: {
      start: e.date,
      end: e.date,
      color: e.color || 'indigo',
      fillMode: 'solid'
    },
    popover: {
      label: e.title,
      content: e.description || ''
    },
    dates: { start: e.date, end: e.date },
    customData: e,
    dot: { color: e.color || 'indigo' },
    title: e.title
  }))
}

function formatMonthYear(date) {
  return format(date, 'MMMM yyyy')
}

function goPrev() {
  focusedDate.value = new Date(focusedDate.value.getFullYear(), focusedDate.value.getMonth() - 1, 1)
}
function goNext() {
  focusedDate.value = new Date(focusedDate.value.getFullYear(), focusedDate.value.getMonth() + 1, 1)
}

function handleDayClick({ date }) {
  // Prefill date and open modal
  newEvent.value.date = format(date, 'yyyy-MM-dd')
  showAddEvent.value = true
}

function handleEventClick({ attributes }) {
  if (attributes?.customData) {
    alert(`${attributes.customData.title}\n${attributes.customData.description || ''}`)
  }
}

function resetModal() {
  showAddEvent.value = false
  newEvent.value = { title: '', description: '', date: '' }
  errors.value = {}
}

function validateEvent() {
  errors.value = {}
  let ok = true
  if (!newEvent.value.title) { errors.value.title = 'Title required'; ok = false }
  if (!newEvent.value.date) { errors.value.date = 'Date required'; ok = false }
  return ok
}

async function createEvent() {
  if (!validateEvent()) return
  saving.value = true
  try {
    const payload = {
      title: newEvent.value.title,
      description: newEvent.value.description,
      date: newEvent.value.date,
      color: 'indigo'
    }
    const { error } = await supabase.from('events').insert(payload)
    if (error) throw error
    resetModal()
    await fetchEvents()
  } catch (err) {
    console.error('Create event error:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.calendar-page {
  /* extra padding already via utility classes */
}
.input-label {
  font-weight: 500;
  color: #555;
}
.input-base {
  border: 1px solid #ccc;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 14px;
}
.error-text {
  color: #e53e3e;
  font-size: 13px;
}
</style> 