<script lang="ts" setup>
import type { FormOption } from '@/types/form-option'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import type { PropType } from 'vue'
import { ref } from 'vue'

const { options, formData, edit, update } = defineProps({
  options: {
    type: Object as PropType<FormOption>,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  edit: {
    type: Boolean,
    required: false,
  },
  update: {
    type: Function,
    required: true,
  },
})

const form = ref({ ...(edit ? formData : {}) })

const rules: FormRules = options.list.map((item) => {
  if (item.required) {
    return { [item.prop]: [{ required: true, message: `${item.label}不能为空`, trigger: 'blur' }] }
  }
  return {}
}).reduce((acc, cur) => ({ ...acc, ...cur }), {})

const formRef = ref<FormInstance>()
function saveEdit(formEl: FormInstance | undefined) {
  if (!formEl)
    return
  formEl.validate((valid) => {
    if (!valid)
      return
    update(form.value)
  })
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  form.value.thumb = URL.createObjectURL(uploadFile.raw!)
}
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules" :label-width="options.labelWidth">
    <el-row>
      <el-col v-for="(item, index) in options.list" :key="index" :span="options.span">
        <el-form-item :label="item.label" :prop="item.prop">
          <!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
          <el-input
            v-if="item.type === 'input'" v-model="form[item.prop]" :disabled="item.disabled"
            :placeholder="item.placeholder" clearable
          />
          <el-input-number
            v-else-if="item.type === 'number'" v-model="form[item.prop]"
            :disabled="item.disabled" controls-position="right"
          />
          <el-select
            v-else-if="item.type === 'select'" v-model="form[item.prop]" :disabled="item.disabled"
            :placeholder="item.placeholder" clearable
          >
            <el-option v-for="(opt, page) in item.opts" :key="page" :label="opt.label" :value="opt.value" />
          </el-select>
          <el-date-picker
            v-else-if="item.type === 'date'" v-model="form[item.prop]" type="date"
            :value-format="item.format"
          />
          <el-switch
            v-else-if="item.type === 'switch'" v-model="form[item.prop]"
            :active-value="item.activeValue" :inactive-value="item.inactiveValue"
            :active-text="item.activeText" :inactive-text="item.inactiveText"
          />
          <el-upload
            v-else-if="item.type === 'upload'" class="avatar-uploader" action="#"
            :show-file-list="false" :on-success="handleAvatarSuccess"
          >
            <img v-if="form[item.prop]" :src="form[item.prop]" class="avatar">
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <slot v-else :name="item.prop" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">
        保 存
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
