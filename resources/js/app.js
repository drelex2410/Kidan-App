import VueNumberInput from "@chenfengyuan/vue-number-input";
import { createApp } from "vue";
import VueSocialSharing from "vue-social-sharing";
import VueTelInput from "vue-tel-input";
import { VueHeadMixin, createHead } from '@unhead/vue';

import "vue-tel-input/vue-tel-input.css";
import "../sass/app.scss";

// CRITICAL: these two lines were missing → Vuetify styling + icons
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import "./bootstrap";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { i18n } from "./plugins/i18n";
import init from "./plugins/init";
import plugins from "./plugins/plugins";          // ← make sure this exports a function
import router from "./router/router.js";
import store from "./store/store";
import Mixin from "./utils/mixin";                  // ← FIXED syntax

import App from './components/App.vue';
import Banner from "./components/inc/Banner.vue";
import DynamicLink from "./components/inc/DynamicLink.vue";
import ProductBox from "./components/product/ProductBox.vue";
import HelperClass from "./utils/helpers";

const shopSetting = window.shopSetting;

const app = createApp(App);

// Dynamic primary color from Laravel
const customDarkTheme = {
    colors: {
        primary: shopSetting?.primaryColor || '#000',
    },
};

const shopSelectedLanguage = localStorage.getItem("shopSelectedLanguage") || "en";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "customDarkTheme",
        themes: { customDarkTheme },
    },
    locale: {
        locale: shopSelectedLanguage,
        fallback: shopSelectedLanguage,
    },
});

const head = createHead();

// Global components
app.component("dynamic-link", DynamicLink);
app.component("banner", Banner);
app.component("product-box", ProductBox);
app.component("vue-number-input", VueNumberInput);

// Initialize store & router (already correct)
init(store, router);

// Register other plugins (call as function, NOT app.use)
plugins(app);   // ← correct way

// Vue plugins
app.mixin(VueHeadMixin);
app.use(head);
app.use(vuetify);
app.use(VueSocialSharing);
app.use(VueTelInput, { mode: "auto" });
app.use(store);
app.use(router);
app.use(i18n);
app.mixin(Mixin);
app.provide('HelperClass', HelperClass);   // or however you want to provide it

// Mount the app
app.mount("#app");