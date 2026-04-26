import { createApp } from "vue";
import "@/assets/css/style.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import App from "./App.vue";
import router from "./routes";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
