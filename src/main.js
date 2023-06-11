import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import Antd from "ant-design-vue";

import router from "@/router/router";
import Observer from "mobx-vue-lite";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";
import "./tailwind.css";
import "ant-design-vue/dist/antd.css";
import "./app.css";

const app = createApp(App);

app.use(ToastPlugin);
app.use(createPinia());
app.use(router);
app.use(Antd);

app.use(Observer);

app.mount("#app");
