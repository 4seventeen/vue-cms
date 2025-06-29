<template>
  <span :class="statusClasses">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['open', 'in-progress', 'resolved', 'closed'].includes(value)
  }
})

const statusClasses = computed(() => {
  return {
    'status-badge': true,
    [`status-${props.status.replace('-', '-')}`]: true
  }
})
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-open {
  background: #e3f2fd;
  color: #1976d2;
}

.status-in-progress {
  background: #fff3e0;
  color: #f57c00;
}

.status-resolved {
  background: #e8f5e8;
  color: #388e3c;
}

.status-closed {
  background: #f5f5f5;
  color: #616161;
}
</style> 