<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-text">{{ loadingText }}</span>
    <span v-else><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  }
})

const buttonClasses = computed(() => {
  return {
    [props.variant]: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Primary variant */
button {
  background: #007bff;
  color: white;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

/* Secondary variant */
button.secondary {
  background: #6c757d;
  color: white;
}

button.secondary:hover:not(:disabled) {
  background: #545b62;
}

/* Danger variant */
button.danger {
  background: #dc3545;
  color: white;
}

button.danger:hover:not(:disabled) {
  background: #c82333;
}

/* Success variant */
button.success {
  background: #28a745;
  color: white;
}

button.success:hover:not(:disabled) {
  background: #218838;
}

.loading-text {
  opacity: 0.8;
}
</style> 