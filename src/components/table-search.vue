<script lang="ts" setup>
import type { FormOptionList } from '@/types/form-option'
import type { FormInstance } from 'element-plus'
import type { PropType } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps({
  query: {
    type: Object,
    required: true,
  },
  options: {
    type: Array as PropType<Array<FormOptionList>>,
    required: true,
  },
  search: {
    type: Function,
    default: () => { },
  },
})

const emit = defineEmits(['update:query'])

const searchRef = ref<FormInstance>()
const localQuery = ref({ ...props.query })

function resetForm(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.resetFields()
  Object.assign(localQuery.value, props.query)
  props.search()
}

function search() {
  emit('update:query', localQuery.value)
  props.search()
}
</script>

<template>
  <div class="search-container">
    <el-form ref="searchRef" :model="localQuery" :inline="true">
      <el-form-item v-for="(item, index) in options" :key="index" :label="item.label" :prop="item.prop">
        <!-- 文本框、下拉框、日期框 -->
        <el-input
          v-if="item.type === 'input'" v-model="localQuery[item.prop]" :disabled="item.disabled"
          :placeholder="item.placeholder" clearable
        />
        <el-select
          v-else-if="item.type === 'select'" v-model="localQuery[item.prop]" :disabled="item.disabled"
          :placeholder="item.placeholder" clearable
        >
          <el-option v-for="(opt, page) in item.opts" :key="page" :label="opt.label" :value="opt.value" />
        </el-select>
        <el-date-picker
          v-else-if="item.type === 'date'" v-model="localQuery[item.prop]" type="date"
          :value-format="item.format"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="search">
          搜索
        </el-button>
        <el-button :icon="Refresh" @click="resetForm(searchRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.search-container {
	padding: 20px 30px 0;
	background-color: #fff;
	margin-bottom: 10px;
	border: 1px solid #ddd;
	border-radius: 5px
}
</style>
