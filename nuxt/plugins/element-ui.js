import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import axios from 'axios'
import echarts from 'echarts'
import 'zrender/lib/svg/svg';
import '../theme/index.css'

Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios;
Vue.use(Element, { locale })

