import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale'
import en from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n);
Vue.use(ElementUI);
locale.use(en);

const i18n = new VueI18n({locale: 'en', messages: require('@/assets/lang/lang.json')});
export default i18n;
new Vue({
  i18n,
  render: h => h(App),
  // 라우터 객체를 넘겨준다
  router
}).$mount('#app')