import Vue from 'vue'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import store from './store/store'
import VueMeta from 'vue-meta';
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(VueMeta);

new Vue({
  store,
  vuetify,
  icons:{
    iconfont: 'md',
    values:{
      beamIcon: './icons/beam.svg',
    }
  },
  render: h => h(App)
}).$mount('#app')
