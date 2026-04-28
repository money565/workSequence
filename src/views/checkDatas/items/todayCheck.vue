<script setup lang="ts">
import { useAppCacheStore } from '@/stores/appCache'

interface IProps {
  date: Date
}

const props = defineProps<IProps>()
const acs = useAppCacheStore()
function init() {

}

onMounted(() => {
  init()
})

watch(() => props.date, () => {
  init()
})
</script>

<template>
  <div>
    今日检查
  </div>
</template>

<style scoped>

</style>
