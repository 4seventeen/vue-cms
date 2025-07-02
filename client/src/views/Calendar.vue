<template>
  <div class="flex justify-center w-full mt-24">
    <div class="w-full max-w-4xl">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Event Calendar</h2>
        <div>
          <v-calendar
            :attributes="calendarEvents"
            is-expanded
            @dayclick="onDayClick"
            @click:event="onEventClick"
            color="primary"
            :weekdays="[0,1,2,3,4,5,6]"
            :min-weeks="5"
            :show-weeknumbers="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const events = [
  {
    start: '2025-07-01',
    end: '2025-07-01',
    title: 'Barangay Meeting',
    content: 'Monthly meeting of barangay council',
    color: 'blue',
  },
  {
    start: '2025-07-05',
    end: '2025-07-05',
    title: 'Hearing: Case #123',
    content: 'Scheduled hearing for case 123',
    color: 'green',
  },
]

const calendarEvents = ref(
  events.map(event => ({
    key: event.title,
    highlight: {
      start: event.start,
      end: event.end,
      color: event.color,
      fillMode: 'solid',
    },
    popover: {
      label: event.title,
      content: event.content,
    },
    dates: { start: event.start, end: event.end },
    customData: event,
    dot: {
      color: event.color,
    },
    title: event.title,
  }))
)

function onEventClick({ event, attributes }) {
  // v-calendar's event click passes the event and attributes
  if (attributes && attributes.customData) {
    console.log('Event clicked:', attributes.customData)
  }
}

function onDayClick(day) {
  // Optionally handle day clicks
  // console.log('Day clicked:', day)
}
</script>

<style scoped>
/* Remove .v-card styles, as Tailwind is now used for layout and spacing */
</style> 