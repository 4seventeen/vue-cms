<template>
  <v-card
    :elevation="elevation"
    :class="cardClass"
    :width="width"
    :height="height"
  >
    <v-card-title v-if="$slots.title || title" class="text-center">
      <slot name="title">{{ title }}</slot>
    </v-card-title>
    
    <v-card-text>
      <slot></slot>
    </v-card-text>
    
    <v-card-actions v-if="$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  elevation: {
    type: Number,
    default: 2
  },
  cardClass: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  title: {
    type: String,
    default: ''
  }
});
</script> 