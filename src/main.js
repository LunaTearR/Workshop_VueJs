import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);
Vue.use(require("vue-cookies"));
Vue.config.productionTip = false;

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faCartPlus,
  faCartShopping,
  faTrash,
  faPen,
  faListUl,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck);
library.add(faCartPlus);
library.add(faCartShopping);
library.add(faTrash);
library.add(faPen);
library.add(faListUl);
library.add(faUser);
library.add(faXmark);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
