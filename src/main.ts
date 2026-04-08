import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { permissDirective } from './utils/permiss'
import '@/assets/styles/index.scss'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import '../src/assets/css/scrollbar.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn,
})
app.directive('permiss', permissDirective)
app.use(createPinia())
app.use(router)
app.mount('#app')
