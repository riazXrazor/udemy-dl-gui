import Vue from 'vue';
import axios from 'axios';
import VueBlu from 'vue-blu'
import 'vue-blu/dist/css/vue-blu.min.css';
import App from './App';
import router from './router';
import { ipcRenderer} from 'electron';
//import db from './datastore';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.use(VueBlu);

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;


  /* eslint-disable no-new */
  let vm = new Vue({
    components: { App },
    router,
    template: '<App/>',
  }).$mount('#app');

  // Vue.prototype.$db = db;


  ipcRenderer.on('udl-logout', function (e, args) {
    vm.$router.push('/login');
  })


