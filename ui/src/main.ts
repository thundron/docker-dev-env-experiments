import { createApp } from "vue";
import Equal from "equal-vue";

import "equal-vue/dist/style.css";

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Equal);
app.mount("#app");
