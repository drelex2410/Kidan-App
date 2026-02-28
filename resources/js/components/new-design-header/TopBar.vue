<template>
    <div class="topbar">
        <!-- Top Banner -->
        <div
            v-if="topBannerVisible && !loading && data.top_banner?.img"
            class="top-banner-container"
        >
            <dynamic-link
                :to="data.top_banner.link"
                append-class="banner-link"
            >
                <img 
                    :src="data.top_banner.img" 
                    alt="top banner"
                    class="banner-image"
                />
            </dynamic-link>
            <button
                class="banner-close-btn"
                @click="closeTopBanner"
                aria-label="Close banner"
            >
                <i class="las la-times"></i>
            </button>
        </div>

        <!-- Top Bar Content -->
        <div class="topbar-content d-none d-md-block">
            <div class="topbar-container">
                <!-- Left Section: Language & Apps -->
                <div class="topbar-left">
                    <!-- Language Switcher -->
                    <div 
                        v-if="data.show_language_switcher == 'on' && allLanguages.length > 1"
                        class="language-switcher"
                    >
                        <v-menu offset-y :close-on-click="menuCloseOnClick">
                            <template #activator="{ props }">
                                <button
                                    class="switcher-btn"
                                    v-bind="props"
                                >
                                    <i class="las la-globe"></i>
                                    <span class="switcher-text">{{ userLanguageObj.name }}</span>
                                    <i class="las la-chevron-down"></i>
                                </button>
                            </template>

                            <v-list class="language-menu">
                                <v-list-item
                                    v-for="(language, i) in allLanguages"
                                    :key="i"
                                    class="language-menu-item"
                                    @click="switchLanguage(language.code)"
                                >
                                    <template #prepend>
                                        <img
                                            :src="static_asset(`/assets/img/flags/${language.flag}.png`)"
                                            :alt="language.name"
                                            class="flag-icon"
                                        />
                                    </template>
                                    <v-list-item-title class="language-item-title">
                                        {{ language.name }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <!-- Divider -->
                    <div 
                        v-if="data.show_language_switcher == 'on' && allLanguages.length > 1"
                        class="topbar-divider"
                    />

                    <!-- Mobile App Links -->
                    <div class="app-links">
                        <a
                            v-if="data.mobile_app_links?.show_play_store == 'on'"
                            :href="data.mobile_app_links.play_store"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="app-link"
                        >
                            <i class="lab la-android"></i>
                            <span>{{ $t("play_store") }}</span>
                        </a>
                        <a
                            v-if="data.mobile_app_links?.show_app_store == 'on'"
                            :href="data.mobile_app_links.app_store"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="app-link"
                        >
                            <i class="lab la-apple"></i>
                            <span>{{ $t("app_store") }}</span>
                        </a>
                    </div>

                    <!-- Divider -->
                    <div 
                        v-if="is_addon_activated('multi_vendor') && data.mobile_app_links?.show_play_store == 'on' || data.mobile_app_links?.show_app_store == 'on'"
                        class="topbar-divider"
                    />

                    <!-- Seller Link -->
                    <router-link
                        v-if="is_addon_activated('multi_vendor')"
                        :to="{ name: 'ShopRegistration' }"
                        class="topbar-link"
                    >
                        <i class="las la-store"></i>
                        <span>{{ $t("be_a_seller") }}</span>
                    </router-link>
                </div>

                <!-- Right Section: User Links -->
                <div class="topbar-right">
                    <!-- Track Order -->
                    <router-link
                        :to="{ name: 'TrackOrder' }"
                        class="topbar-link"
                    >
                        <i class="las la-box"></i>
                        <span>{{ $t("track_order") }}</span>
                    </router-link>

                    <div class="topbar-divider" />

                    <!-- Help Line -->
                    <a
                        :href="'tel:' + data.helpline"
                        class="topbar-link"
                    >
                        <i class="las la-phone"></i>
                        <span class="helpline-text">
                            {{ $t("help_line") }}: {{ data.helpline }}
                        </span>
                    </a>

                    <div class="topbar-divider" />

                    <!-- Compare List -->
                    <router-link
                        v-if="generalSettings.product_comparison == 1"
                        :to="{ name: 'ComparedList' }"
                        class="topbar-link"
                    >
                        <i class="las la-balance-scale"></i>
                        <span>{{ $t("compare_list") }} ({{ getTotalComparedList }})</span>
                    </router-link>

                    <!-- Wishlist -->
                    <router-link
                        :to="{ name: 'Wishlist' }"
                        class="topbar-link"
                    >
                        <i class="las la-heart"></i>
                        <span>{{ $t("wishlist") }} ({{ getTotalWishlisted }})</span>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="topbar-divider-full" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import helpers from "../../utils/helpers";

export default {
    props: {
        loading: { type: Boolean, required: true, default: true },
        data: {
            type: Object,
            default: {},
        },
    },
    data: () => ({
        topBannerVisible: false,
        menuCloseOnClick: true,
    }),
    computed: {
        ...mapGetters("app", ["generalSettings"]),
        ...mapGetters("wishlist", ["getTotalWishlisted"]),
        ...mapGetters("compareList", ["getTotalComparedList"]),
        ...mapGetters("app", [
            "userLanguageObj",
            "allLanguages",
            "allCurrencies",
        ]),
    },
    methods: {
        ...mapActions("app", ["fetchProductQuerries"]),
        ...mapActions("wishlist", ["fetchWislistProducts"]),
        ...mapActions("app", ["setLanguage"]),

        switchLanguage(locale) {
            if (this.$i18n.locale !== locale) {
                this.setLanguage(locale);
                this.$i18n.locale = locale;
                window.location.reload();
            }
        },

        closeTopBanner() {
            this.topBannerVisible = false;
            this.setSession("shopTopBanner", "hidden");
        },
    },

    created() {
        if (this.checkSession("shopTopBanner") != "hidden") {
            this.topBannerVisible = true;
        }
        this.fetchWislistProducts();
        this.fetchProductQuerries();

        if (!localStorage.getItem("shopSelectedLanguage")) {
            localStorage.setItem("shopSelectedLanguage", shopSetting.appLanguage);
            this.$i18n.locale = shopSetting.appLanguage;
        }
    },
};
</script>

<style scoped>
/* ===================================
   BASE TOPBAR
   =================================== */
.topbar {
    position: relative;
    z-index: 999;
    background-color: #b8a688 !important;
    border-bottom: none !important;
    color: #000 !important;
}

.topbar,
.topbar *,
.topbar-content,
.top-banner-container {
    background-color: #b8a688 !important;
    border-bottom: none !important;
    color: #000 !important;
}


/* ===================================
   TOP BANNER
   =================================== */
.top-banner-container {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #2e1a1a 0%, #3d2222 100%);
    height: 50px;
}

.banner-link {
    display: block;
    line-height: 0;
    height: 100%;
    text-decoration: none;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.banner-close-btn {
    position: absolute;
    top: 8px;
    right: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    z-index: 2;
}

.banner-close-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
}

/* ===================================
   TOPBAR CONTENT
   =================================== */
.topbar-content {
    background-color: #f9f9f9;
    padding: 0.75rem 0;
    border-bottom: 1px solid #efefef;
}

.topbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    font-size: 0.8125rem;
}

.topbar-left,
.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.topbar-right {
    justify-content: flex-end;
    flex: 1;
}

/* ===================================
   LANGUAGE SWITCHER
   =================================== */
.language-switcher {
    display: flex;
    align-items: center;
}

.switcher-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    transition: all 0.2s;
    font-family: inherit;
}

.switcher-btn:hover {
    color: #8b4513;
}

.switcher-btn i:first-child {
    font-size: 1rem;
    color: #8b4513;
}

.switcher-btn i:last-child {
    font-size: 0.75rem;
    transition: transform 0.2s;
}

.switcher-btn:hover i:last-child {
    transform: rotate(180deg);
}

.switcher-text {
    white-space: nowrap;
}

.language-menu {
    min-width: 180px;
}

.language-menu-item {
    cursor: pointer;
    padding: 0.5rem 1rem !important;
    transition: background-color 0.2s;
}

.language-menu-item:hover {
    background-color: #f8f8f8;
}

.flag-icon {
    width: 16px;
    height: 12px;
    object-fit: cover;
    border-radius: 2px;
    margin-right: 0.5rem !important;
}

.language-item-title {
    font-size: 0.8125rem;
    color: #333;
}

/* ===================================
   APP LINKS
   =================================== */
.app-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.app-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #666;
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: color 0.2s;
    white-space: nowrap;
}

.app-link:hover {
    color: #8b4513;
}

.app-link i {
    font-size: 1rem;
    color: #8b4513;
}

/* ===================================
   TOPBAR LINKS & DIVIDERS
   =================================== */
.topbar-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #666;
    text-decoration: none;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
}

.topbar-link:hover {
    color: #8b4513;
}

.topbar-link i {
    font-size: 0.95rem;
    color: #8b4513 !important;
}

.helpline-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.topbar-divider {
    width: 1px;
    height: 16px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(139, 69, 19, 0.3), rgba(0, 0, 0, 0));
    flex-shrink: 0;
}

.topbar-divider-full {
    height: 1px;
    background: linear-gradient(90deg, transparent, #efefef, transparent);
    width: 100%;
}

/* ===================================
   RESPONSIVE
   =================================== */
@media (max-width: 1200px) {
    .topbar-container {
        padding: 0 1.5rem;
        gap: 1.5rem;
    }

    .helpline-text {
        flex-direction: column;
        gap: 0;
    }
}

@media (max-width: 991px) {
    .topbar-content {
        display: none !important;
    }

    .topbar-container {
        flex-direction: column;
        gap: 1rem;
    }

    .topbar-left,
    .topbar-right {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .topbar {
        border-bottom: none;
    }

    .top-banner-container {
        height: 40px;
    }

    .topbar-divider-full {
        display: none;
    }
}
</style>