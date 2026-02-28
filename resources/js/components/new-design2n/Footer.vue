<template>
  <footer class="lv-footer">
    <v-container class="main-footer">
      <!-- Logo -->
      <div class="logo-section">
        <img :src="data.footer_logo" class="footer-logo" />
      </div>

      <v-row class="footer-content">
        <!-- Newsletter / Email Signup -->
        <v-col cols="12" sm="8" md="6" lg="3">
          <div class="newsletter-title">
            {{ $t("get_your_special_offers_coupons__more") }}
          </div>

          <v-form @submit.prevent="subscribe()">
            <v-text-field :placeholder="$t('your_email_address')" type="email" v-model="subscribeForm.email"
              hide-details="auto" required variant="plain" class="email-input"></v-text-field>

            <p v-for="error of v$.subscribeForm.email.$errors" :key="error.$uid" class="error-text">
              {{ error.$message }}
            </p>

            <v-btn type="submit" class="subscribe-btn" :loading="subscribeFormLoading" :disabled="subscribeFormLoading">
              {{ $t("subscribe") }}
            </v-btn>
          </v-form>
        </v-col>

        <!-- Desktop Columns -->
        <v-col class="d-none d-lg-block" lg="2" offset-lg="1">
          <h4 class="column-title">{{ data.footer_link_one?.title }}</h4>
          <ul class="footer-links">
            <li v-for="(link, label, i) in data.footer_link_one?.menu" :key="i">
              <dynamic-link :to="link" class="footer-link">{{ label }}</dynamic-link>
            </li>
          </ul>
        </v-col>

        <v-col class="d-none d-lg-block" lg="2">
          <h4 class="column-title">{{ data.footer_link_two?.title }}</h4>
          <ul class="footer-links">
            <li v-for="(link, label, i) in data.footer_link_two?.menu" :key="i">
              <dynamic-link :to="link" class="footer-link">{{ label }}</dynamic-link>
            </li>
          </ul>
        </v-col>

        <v-col class="d-none d-lg-block" lg="2">
          <h4 class="column-title">{{ $t("contact_us") }}</h4>
          <ul class="contact-list">
            <li>
              <span class="contact-label"><i class="las la-home"></i> {{ $t("address") }}</span>
              <div>{{ data.contact_info?.contact_address }}</div>
            </li>
            <li>
              <span class="contact-label"><i class="las la-envelope"></i> {{ $t("email") }}</span>
              <div>{{ data.contact_info?.contact_email }}</div>
            </li>
            <li>
              <span class="contact-label"><i class="las la-phone"></i> {{ $t("phone") }}</span>
              <div>{{ data.contact_info?.contact_phone }}</div>
            </li>
          </ul>
        </v-col>

        <v-col class="d-none d-lg-block" lg="2">
          <div v-if="app_store || play_store">
            <h4 class="column-title">{{ $t("mobile_apps") }}</h4>
            <a v-if="play_store" :href="data.mobile_app_links?.play_store" target="_blank" class="app-link">
              <img :src="static_asset('/assets/img/play_store.png')" height="40" />
            </a>
            <a v-if="app_store" :href="data.mobile_app_links?.app_store" target="_blank" class="app-link">
              <img :src="static_asset('/assets/img/app_store.png')" height="40" />
            </a>
          </div>

          <div v-if="is_addon_activated('multi_vendor')">
            <h4 class="column-title mt-4">{{ $t("seller_zone") }}</h4>
            <ul class="footer-links">
              <li><router-link :to="{ name: 'ShopRegistration' }" class="footer-link">{{ $t('be_a_seller')
              }}</router-link></li>
              <li><a :href="$store.getters['app/appUrl'] + '/login'" target="_blank" class="footer-link">{{
                $t('login_to_seller_panel') }}</a></li>
            </ul>
          </div>
        </v-col>

        <!-- Mobile Accordion -->
        <v-col cols="12" class="d-lg-none">
          <v-expansion-panels flat accordion class="mobile-panels">
            <!-- Link One -->
            <v-expansion-panel class="panel">
              <v-expansion-panel-title class="panel-title">
                <h4 class="column-title mb-0">{{ data.footer_link_one?.title }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ul class="footer-links">
                  <li v-for="(link, label, i) in data.footer_link_one?.menu" :key="i">
                    <dynamic-link :to="link" class="footer-link">{{ label }}</dynamic-link>
                  </li>
                </ul>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Link Two -->
            <v-expansion-panel class="panel">
              <v-expansion-panel-title class="panel-title">
                <h4 class="column-title mb-0">{{ data.footer_link_two?.title }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ul class="footer-links">
                  <li v-for="(link, label, i) in data.footer_link_two?.menu" :key="i">
                    <dynamic-link :to="link" class="footer-link">{{ label }}</dynamic-link>
                  </li>
                </ul>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Contact -->
            <v-expansion-panel class="panel">
              <v-expansion-panel-title class="panel-title">
                <h4 class="column-title mb-0">{{ $t("contact_us") }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <ul class="contact-list">
                  <li>
                    <span class="contact-label"><i class="las la-home"></i> {{ $t("address") }}</span>
                    <div>{{ data.contact_info?.contact_address }}</div>
                  </li>
                  <li>
                    <span class="contact-label"><i class="las la-envelope"></i> {{ $t("email") }}</span>
                    <div>{{ data.contact_info?.contact_email }}</div>
                  </li>
                  <li>
                    <span class="contact-label"><i class="las la-phone"></i> {{ $t("phone") }}</span>
                    <div>{{ data.contact_info?.contact_phone }}</div>
                  </li>
                </ul>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Mobile Apps -->
            <v-expansion-panel class="panel" v-if="app_store || play_store">
              <v-expansion-panel-title class="panel-title">
                <h4 class="column-title mb-0">{{ $t("mobile_apps") }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <a v-if="play_store" :href="data.mobile_app_links?.play_store" target="_blank"
                  class="app-link d-inline-block">
                  <img :src="static_asset('/assets/img/play_store.png')" height="40" />
                </a>
                <a v-if="app_store" :href="data.mobile_app_links?.app_store" target="_blank"
                  class="app-link d-inline-block ms-2">
                  <img :src="static_asset('/assets/img/app_store.png')" height="40" />
                </a>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <!-- Bottom Menu -->
      <div class="bottom-menu">
        <ul class="menu-list">
          <li v-for="(link, label, i) in data.footer_menu" :key="i" :class="{ 'ms-6': i !== 0 }">
            <dynamic-link :to="link" class="menu-link">{{ label }}</dynamic-link>
          </li>
        </ul>
      </div>

      <!-- Copyright & Social -->
      <v-row class="copyright-row">
        <v-col md="6" cols="12">
          <div v-html="data.copyright_text" class="copyright-text"></div>
        </v-col>
        <v-col md="6" cols="12" class="text-md-end">
          <ul class="social-list">
            <li v-for="(link, label, i) in data.social_link" :key="i" :class="{ 'ms-3': i !== 0 }">
              <a :href="link" target="_blank" class="social-icon">
                <i :class="['lab', 'la-' + label]"></i>
              </a>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </footer>

  <!-- Cookie Dialog -->
  <div v-if="getCookieDescription" class="cookie-dialog-container">
    <v-dialog v-model="showCookie" max-width="400" persistent>
      <v-card class="cookie-card">
        <v-card-title class="cookie-title">{{ getCookieTitle }}</v-card-title>
        <v-card-text class="cookie-text" v-html="getCookieDescription"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="accept-btn" @click="setCookie(true)">Accept Cookies</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    loading: true,
    data: {},
    v$: useVuelidate(),
    subscribeForm: { email: "" },
    subscribeFormLoading: false,
    app_store: null,
    play_store: null,
    showCookie: false,
  }),

  validations() {
    return {
      subscribeForm: {
        email: { required, email },
      },
    };
  },

  computed: {
    ...mapGetters("app", ["appName", "generalSettings", "getCookieStatus", "getCookieTitle", "getCookieDescription"]),
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapGetters("affiliate", ["isAffiliatedUser"]),
  },

  methods: {
    ...mapActions("affiliate", ["fetchAffiliatedUser"]),
    ...mapActions("app", ["setCookie"]),

    async setCookie(status) {
      document.cookie = `${this.appName}-cookie=${this.getCookieDescription}`;
      localStorage.setItem("cookieStatus", status);
      this.showCookie = false;
    },

    async getDetails() {
      const res = await this.call_api("get", `setting/footer`);
      if (res.status === 200) {
        this.data = res.data;
        this.app_store = res.data.mobile_app_links.app_store;
        this.play_store = res.data.mobile_app_links.play_store;
        this.loading = false;
      }
    },

    async subscribe() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;
      this.subscribeFormLoading = true;
      const res = await this.call_api("post", "subscribe", this.subscribeForm);
      this.snack({ message: res.data.message });
      this.subscribeFormLoading = false;
    },
  },

  created() {
    if (this.getCookieStatus == null) this.showCookie = true;
    this.getDetails();
    if (this.isAuthenticated) this.fetchAffiliatedUser();
  },
};
</script>

<style scoped>
/* === LOUIS VUITTON FOOTER - BLACK & WHITE === */
.lv-footer {
  background-color: #ffffff;
  color: #000000 !important;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding-top: 60px;
  padding-bottom: 40px;
  font-size: 13px;
  line-height: 1.6;
}

.main-footer {
  max-width: 1400px;
  padding: 0 20px;
}

/* Logo */
.logo-section {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 30px;
  margin-bottom: 40px;
}

.footer-logo {
  height: 28px;
  width: auto;
}

/* Newsletter */
.newsletter-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  color: #000 !important;
}

.email-input ::v-deep(.v-field) {
  background-color: #fff !important;
  border: 1px solid #000;
  border-radius: 0;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
}

.email-input ::v-deep(.v-field__input) {
  padding: 0;
  min-height: 46px;
  font-size: 14px;
}

.email-input ::v-deep(.v-field__outline) {
  display: none;
}

.subscribe-btn {
  background-color: #000 !important;
  color: #fff !important;
  border: 1px solid #000 !important;
  height: 48px !important;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 32px;
  margin-top: 12px;
  border-radius: 0;
}

.subscribe-btn:hover {
  background-color: #fff !important;
  color: #000 !important;
}

/* Column Titles */
.column-title {
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  color: #000 !important;
}

/* Links */
.footer-links,
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.contact-list li {
  margin-bottom: 12px;
}

.footer-link {
  color: #000 !important;
  text-decoration: none;
  font-size: 13px;
  transition: opacity 0.2s;
}

.footer-link:hover {
  opacity: 0.7;
}

/* Contact */
.contact-label {
  color: #666 !important;
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}

.contact-label i {
  font-size: 14px;
  margin-right: 8px;
  vertical-align: middle;
}

.contact-list div {
  font-size: 13px;
  color: #000 !important;
}

/* App Links */
.app-link {
  display: inline-block;
  margin-right: 8px;
}

/* Mobile Panels */
.mobile-panels {
  background: transparent;
}

.mobile-panels ::v-deep(.v-expansion-panel) {
  background: transparent;
  box-shadow: none;
  margin-bottom: 0;
}

.mobile-panels ::v-deep(.v-expansion-panel-title) {
  padding: 16px 0;
  min-height: auto;
}

.mobile-panels ::v-deep(.v-expansion-panel-title__overlay) {
  display: none;
}

.mobile-panels ::v-deep(.v-expansion-panel-text__wrapper) {
  padding: 0 0 20px 0;
}

.panel {
  border-bottom: 1px solid #e5e5e5;
}

.panel-title::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='%23000' d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'/%3E%3C/svg%3E") no-repeat center;
  background-size: contain;
}

/* Bottom Menu */
.bottom-menu {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 16px 0;
  margin: 40px 0;
}

.menu-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
}

.menu-link {
  color: #000 !important;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-link:hover {
  text-decoration: underline;
}

/* Copyright & Social */
.copyright-row {
  align-items: center;
  font-size: 12px;
}

.copyright-text {
  color: #666 !important;
  line-height: 1.6;
}

.social-list {
  display: flex;
  justify-content: flex-end;
  list-style: none;
  padding: 0;
  margin: 0;
}

.social-icon {
  color: #000 !important;
  font-size: 18px;
  transition: opacity 0.2s;
}

.social-icon:hover {
  opacity: 0.6;
}

/* Cookie Dialog */
.cookie-dialog-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.cookie-card {
  border: 1px solid #000;
  border-radius: 0;
}

.cookie-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 16px 24px;
  background: #000;
  color: #fff !important;
}

.cookie-text {
  font-size: 13px;
  padding: 20px 24px;
  color: #000 !important;
}

.accept-btn {
  background: #000 !important;
  color: #fff !important;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  height: 40px !important;
  border-radius: 0;
}

/* Responsive */
@media (max-width: 960px) {

  .newsletter-title,
  .column-title {
    font-size: 13px;
  }

  .email-input ::v-deep(.v-field),
  .subscribe-btn {
    height: 44px !important;
  }
}
</style>