<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card>
          <v-card-title class="text-h5">Event Calendar</v-card-title>
          <v-card-text>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
.v-card {
  margin-top: 100px;
  width: 100%;
  height: 100%;
}
</style> 