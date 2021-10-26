import Vue from 'vue'
import Router from 'vue-router';
import Index from '@/views/Index.vue';
import Schedule from '@/views/Schedule.vue';
import Memo from '@/views/Memo.vue';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', name: 'Index', title: 'menu.index', component: Index, icon: 'el-icon-s-platform', depth: 0, index: '0', parentIndex: null},
    {path: '/memo', name: 'Memo', title: 'menu.memo', component: Memo, icon: 'el-icon-s-order', depth: 0, index: '2', parentIndex: null},
    {path: '/schedule', name: 'Schedule', title: 'menu.schedule', component: Schedule, icon: 'el-icon-date', depth: 0, index: '3', parentIndex: null},
  ],
  mode: 'history'
})
