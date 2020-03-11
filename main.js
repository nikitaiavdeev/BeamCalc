import Vue from 'vue'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import store from './store/store'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  icons:{
    iconfont: 'md',
  },
  render: h => h(App)
}).$mount('#app')
