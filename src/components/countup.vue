<script setup lang="ts">
import { CountUp } from 'countup.js'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  end: {
    type: Number,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
    required: false,
  },
})

const countRef = ref<any>(null)
let countUp: any
onMounted(() => {
  countUp = new CountUp(countRef.value, props.end, props.options)
  if (countUp.error) {
    console.error(countUp.error)
    return
  }
  countUp.start()
})

watch(() => props.end, (newVal) => {
  if (countUp) {
    countUp.update(newVal)
  }
})
</script>

<template>
  <span ref="countRef" />
</template>
