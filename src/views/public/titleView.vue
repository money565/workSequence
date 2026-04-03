<script setup lang="ts">
interface titleOpt {
  title: string
}

const props = defineProps<titleOpt>()
</script>

<template>
  <div class="w-400 bg-orange-400 pl-5 ml--5 mt--10 mr-0">
    <h3 class="p-2 text-white">
      {{ props.title }}
    </h3>
  </div>
</template>

<style scoped>

</style>
