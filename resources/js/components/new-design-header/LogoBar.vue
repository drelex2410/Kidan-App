<template>
    <div class="logobar">
        <v-container class="pb-md-0 pt-4 pa-0">
            <div class="d-flex align-center logo-bar-container">
                <!-- Menu Button for Sidebar (Mobile Only) -->
                <button class="menu-btn d-md-none" @click="toggleSidebar">
                    <i class="las la-bars"></i>
                </button>
                <div class="logo-section">
                    <router-link :to="{ name: 'Home' }" class="logo-link d-block lh-0">
                        <img :src="appLogo" :alt="appName" class="logo-img" height="40" />
                    </router-link>
                </div>
                <v-spacer />
                <div :class="['flex-grow-1 search-section', { 'search-open': openSearch }]">
                    <v-form class="search-form" @submit.stop.prevent="search()">
                        <div class="search-form-inner">
                            <button class="search-back-btn d-md-none" @click.stop="toggleSearch(false)" type="button">
                                <i class="las la-arrow-left"></i>
                            </button>
                            <input
                                type="text"
                                class="search-input"
                                :placeholder="$t('search_for_products_brands_and_more')"
                                v-model="searchKeyword"
                                @keyup="ajaxSearch"
                                required
                            />
                            <button class="search-submit-btn d-none d-md-flex" type="submit">
                                <i class="las la-search search-icon"></i>
                                <span class="search-text">{{ $t("search") }}</span>
                            </button>
                        </div>
                    </v-form>
                    <div class="search-suggestions bg-white shadow-lg position-absolute" v-if="showSuggestionContainer">
                        <div class="search-loading text-center py-4" v-if="loadingSuggestion">
                            <v-progress-circular indeterminate :width="3" color="primary"></v-progress-circular>
                        </div>
                        <div v-else>
                            <div v-if="suggestionNotFound" class="no-results text-center ma-8 fs-16">
                                <i class="las la-search no-results-icon"></i>
                                <p class="no-results-text">{{ $t("sorry_nothing_found") }}</p>
                            </div>
                            <div class="suggestions-content" v-else>
                                <!-- Tags -->
                                <div class="suggestion-group" v-if="keywords.length">
                                    <div class="suggestion-header px-2 py-1 text-uppercase fs-10 text-right bg-grey-lighten-3">
                                        <i class="las la-fire suggestion-icon"></i>
                                        {{ $t('popular_suggestions') }}
                                    </div>
                                    <ul class="suggestion-list list-unstyled px-5 py-2 fs-13">
                                        <li
                                            v-for="(keyword, i) in keywords"
                                            :key="i"
                                            class="suggestion-item py-1 text-capitalize"
                                            @click="popularSuggesation(keyword)"
                                        >
                                            <i class="las la-search suggestion-item-icon"></i>
                                            <span class="suggestion-item-text">{{ keyword }}</span>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Product Suggestions -->
                                <div class="suggestion-group" v-if="products.length">
                                    <div class="suggestion-header px-2 py-1 text-uppercase fs-10 text-right bg-grey-lighten-3">
                                        <i class="las la-shopping-bag suggestion-icon"></i>
                                        {{ $t('products') }}
                                    </div>
                                    <ul class="suggestion-list list-unstyled px-5 py-2 fs-13">
                                        <li
                                            v-for="(product, i) in products"
                                            :key="i"
                                            class="suggestion-item py-1 d-flex align-center product-item"
                                        >
                                            <div class="product-image-container">
                                                <img
                                                    :src="product.thumbnail_image"
                                                    :alt="product.name"
                                                    @error="imageFallback($event)"
                                                    class="product-img img-fit size-50px"
                                                />
                                            </div>
                                            <div class="product-info ml-2">
                                                <router-link
                                                    :to="{ name: 'ProductDetails', params: {slug: product.slug}}"
                                                    class="product-name opacity-60 mb-1 fs-13 text-reset"
                                                    @click="hideSearchContainer"
                                                >
                                                    {{ product.name }}
                                                </router-link>
                                                <div class="product-price order-2 fs-14 lh-1">
                                                    <template v-if="product.base_price > product.base_discounted_price">
                                                        <del class="original-price opacity-40">{{ format_price(product.base_price) }}</del>
                                                        <span class="discounted-price fw-700 text-red">{{ format_price(product.base_discounted_price) }}</span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="discounted-price fw-700 text-red">{{ format_price(product.base_discounted_price) }}</span>
                                                    </template>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Category Suggestions -->
                                <div class="suggestion-group" v-if="searchCategories.length">
                                    <div class="suggestion-header px-2 py-1 text-uppercase fs-10 text-right bg-grey-lighten-3">
                                        <i class="las la-list suggestion-icon"></i>
                                        {{ $t('category_suggestions') }}
                                    </div>
                                    <ul class="suggestion-list list-unstyled px-5 fs-13">
                                        <li
                                            v-for="(category, i) in searchCategories"
                                            :key="i"
                                            class="suggestion-item py-1"
                                            @click="hideSearchContainer"
                                        >
                                            <i class="las la-folder suggestion-item-icon"></i>
                                            <router-link
                                                :to="{ name: 'Category', params: {categorySlug: category.slug}}"
                                                class="suggestion-link text-reset text-capitalize"
                                            >
                                                {{ category.name }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Brand Suggestions -->
                                <div class="suggestion-group" v-if="brands.length">
                                    <div class="suggestion-header px-2 py-1 text-uppercase fs-10 text-right bg-grey-lighten-3">
                                        <i class="las la-tags suggestion-icon"></i>
                                        {{ $t('brands') }}
                                    </div>
                                    <ul class="suggestion-list list-unstyled px-5 fs-13">
                                        <li
                                            v-for="(brand, i) in brands"
                                            :key="i"
                                            class="suggestion-item py-1"
                                            @click="hideSearchContainer"
                                        >
                                            <i class="las la-copyright suggestion-item-icon"></i>
                                            <router-link
                                                :to="{ name: 'Brand', params: {brandId: brand.id }}"
                                                class="suggestion-link text-reset text-capitalize"
                                            >
                                                {{ brand.name }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                                <!-- Shop Suggestions -->
                                <div class="suggestion-group" v-if="shops.length">
                                    <div class="suggestion-header px-2 py-1 text-uppercase fs-10 text-right bg-grey-lighten-3">
                                        <i class="las la-store suggestion-icon"></i>
                                        {{ $t('Shops') }}
                                    </div>
                                    <ul class="suggestion-list list-unstyled px-5 py-2 fs-13">
                                        <li
                                            v-for="(shop, i) in shops"
                                            :key="i"
                                            class="suggestion-item py-1 d-flex align-center product-item"
                                        >
                                            <div class="shop-image-container">
                                                <img
                                                    :src="shop.logo"
                                                    :alt="shop.name"
                                                    @error="imageFallback($event)"
                                                    class="shop-img img-fit size-30px"
                                                />
                                            </div>
                                            <div class="product-info ml-3">
                                                <router-link
                                                    :to="{ name: 'ShopDetails', params: {slug: shop.slug}}"
                                                    class="product-name opacity-60 mb-1 fs-13 text-reset"
                                                    @click="hideSearchContainer"
                                                >
                                                    {{ shop.name }}
                                                </router-link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="mobile-search-btn d-md-none" @click.stop="toggleSearch(true)">
                    <i class="las la-search"></i>
                </button>
                <v-spacer class="d-none d-md-block" />
                <div class="user-actions d-none d-md-block">
                    <div class="auth-links d-flex align-center" v-if="!isAuthenticated">
                        <div class="auth-icon-container">
                            <i class="las la-user user-icon"></i>
                        </div>
                        <div class="auth-text-container">
                            <router-link
                                :to="{ name: 'Login' }"
                                class="auth-link text-reset opacity-80 fw-500"
                            >
                                {{ $t("login") }}
                            </router-link>
                            <span class="auth-divider mx-3 opacity-60">{{ $t("or") }}</span>
                            <router-link
                                :to="{ name: 'Registration' }"
                                class="auth-link text-reset opacity-80 fw-500"
                            >
                                {{ $t("registration") }}
                            </router-link>
                        </div>
                    </div>
                    <!-- Dashboard -->
                    <div class="auth-links d-flex align-center" v-else>
                        <!-- Notification -->
                        <div class="notification-container" v-if="currentUser.user_type == 'customer'">
                            <button class="notification-btn" id="menu-activator" @click="fetNotification">
                                <i class="las la-bell"></i>
                            </button>
                            <v-menu activator="#menu-activator">
                                <v-list>
                                    <v-list-item>
                                        <h2 class="text-center">{{ $t('notifications') }}</h2>
                                    </v-list-item>
                                    <v-divider class="mb-2"></v-divider>
                                    <div class="notifications-menu">
                                        <v-list-item
                                            v-for="(notification, index) in notifications"
                                            :key="index"
                                            :value="index"
                                        >
                                            <v-list-item-title class="py-2 border-bottom">
                                                <v-btn
                                                    @click="openOrderDetails(notification.data.order_code)"
                                                    text
                                                    small
                                                    class="px-2 text-primary"
                                                >
                                                    {{ notification.data.order_code }} {{ $t('has_been') }}{{ notification.data.status }}
                                                </v-btn>
                                            </v-list-item-title>
                                        </v-list-item>
                                    </div>
                                    <v-list-item class="text-center mt-2 border-top">
                                        <router-link
                                            :to="{ name: 'Notification'}"
                                            class="text-reset fs-14"
                                        >
                                            <p class="text-center">{{ $t('view_all_notifications') }}</p>
                                        </router-link>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        <!-- End of Notification -->
                        <div class="auth-icon-container">
                            <i class="las la-user user-icon"></i>
                        </div>
                        <div class="auth-text-container">
                            <router-link
                                :to="{ name: currentUser.user_type == 'delivery_boy' ? 'DeliveryBoyDashboard' : 'DashBoard' }"
                                class="auth-link text-reset opacity-80 fw-500"
                            >
                                {{ $t("dashboard") }}
                            </router-link>
                            <span class="auth-divider mx-3 opacity-60">{{ $t('or') }}</span>
                            <div
                                class="auth-link logout-link text-reset opacity-80 fw-500 c-pointer"
                                @click.stop="logout"
                            >
                                {{ $t("logout") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-container>
        <!-- Sidebar for Categories (Mobile Only) -->
        <div class="sidebar" :class="{ 'sidebar-open': showSidebar }">
            <div class="sidebar-header">
                <button class="sidebar-close-btn" @click="toggleSidebar">
                    <i class="las la-times"></i>
                </button>
                <h2 class="sidebar-title">{{ $t("all_categories") }}</h2>
            </div>
            <div class="sidebar-content">
                <div v-if="loadingCategories" class="loading-state">
                    <v-skeleton-loader type="table" class="w-100"></v-skeleton-loader>
                </div>
                <div v-else-if="categories.length" class="categories-list">
                    <div
                        v-for="(category, i) in categories"
                        :key="`category-${i}`"
                        class="category-item"
                    >
                        <router-link
                            :to="{ name: 'Category', params: { categorySlug: category.slug } }"
                            class="category-link"
                            @click="toggleSidebar"
                        >
                            <span>{{ category.name }}</span>
                            <i class="las la-arrow-right"></i>
                        </router-link>
                        <div v-if="category.children?.data?.length" class="subcategories">
                            <router-link
                                v-for="(child, j) in category.children.data"
                                :key="`child-${j}`"
                                :to="{ name: 'Category', params: { categorySlug: child.slug } }"
                                class="subcategory-link"
                                @click="toggleSidebar"
                            >
                                {{ child.name }}
                            </router-link>
                        </div>
                    </div>
                </div>
                <div v-else class="no-categories">
                    <i class="las la-inbox"></i>
                    <p>{{ $t("no_categories_found") }}</p>
                </div>
            </div>
        </div>
        <div class="sidebar-overlay" v-if="showSidebar" @click="toggleSidebar"></div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    props: {
        loading: { type: Boolean, required: true, default: true },
        data: {
            type: Object,
            default: {},
        },
    },
    data: () => ({
        openSearch: false,
        searchKeyword: "",
        loadingSuggestion: false,
        showSuggestionContainer: false,
        suggestionNotFound: false,
        keywords: [],
        searchCategories: [], // Renamed to avoid conflict
        brands: [],
        products: [],
        shops: [],
        notifications: [],
        showSidebar: false,
        loadingCategories: true,
        categories: [], // For sidebar categories
    }),
    computed: {
        ...mapGetters("app", ["appLogo", "appName"]),
        ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
    },
    methods: {
        ...mapActions(["auth/logout"]),
        ...mapActions("cart", ["resetCart"]),
        ...mapActions("wishlist", ["resetWishlist"]),
        openOrderDetails(orderCode) {
            this.$router.push({ name: "OrderDetails", params: { code: orderCode } });
        },
        async fetNotification() {
            const res = await this.call_api("get", `user/notification`);
            if (res.data.success) {
                this.notifications = res.data.notifications;
            }
        },
        search() {
            this.showSuggestionContainer = false;
            this.$router
                .push({
                    name: "Search",
                    params: this.searchKeyword.length > 0 ? { keyword: this.searchKeyword } : {},
                    query: { page: 1 },
                })
                .catch(() => {});
        },
        hideSearchContainer() {
            this.showSuggestionContainer = false;
        },
        popularSuggesation(tag) {
            this.showSuggestionContainer = false;
            this.searchKeyword = tag;
            this.search();
        },
        async ajaxSearch(event) {
            this.loadingSuggestion = true;
            this.showSuggestionContainer = false;
            const searchKey = event.target.value;
            if (searchKey.length > 0) {
                this.showSuggestionContainer = true;
                const res = await this.call_api("get", `search.ajax/${searchKey}`);
                if (res.data.success) {
                    this.suggestionNotFound = false;
                    this.loadingSuggestion = false;
                    this.keywords = res.data.keywords;
                    this.searchCategories = res.data.categories;
                    this.brands = res.data.brands;
                    this.products = res.data.products.data;
                    this.shops = res.data.shops.data;
                } else {
                    this.loadingSuggestion = false;
                    this.suggestionNotFound = true;
                }
            }
        },
        async logout() {
            const res = await this.call_api("get", "auth/logout");
            this["auth/logout"]();
            this.resetCart();
            this.resetWishlist();
            this.$router.push({ name: "Home" }).catch(() => {});
        },
        toggleSearch(status) {
            this.openSearch = status;
        },
        toggleSidebar() {
            this.showSidebar = !this.showSidebar;
        },
        onClick(event) {
            let trigger = document.querySelector(".search-suggestions");
            if (trigger && !trigger.contains(event.target)) {
                this.showSuggestionContainer = false;
            }
        },
        async fetchCategories() {
            try {
                this.loadingCategories = true;
                const res = await this.call_api("get", "all-categories");
                if (res.data.success) {
                    this.categories = res.data.data;
                }
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                this.loadingCategories = false;
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.onClick);
        this.fetchCategories();
    },
    beforeDestroy() {
        document.removeEventListener('click', this.onClick);
    },
};
</script>

<style scoped>
/* ===================================
   BASE LOGOBAR STYLES
   =================================== */
.logobar {
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
    background-color: #3d2222;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.logo-bar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
}
/* ===================================
   MENU BUTTON (Mobile Only)
   =================================== */
.menu-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}
.menu-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}
/* ===================================
   SIDEBAR STYLES (Mobile Only)
   =================================== */
.sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 300px;
    height: 100%;
    background: #2e1a1a;
    z-index: 1001;
    transition: left 0.3s ease;
    overflow-y: auto;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar-open {
    left: 0;
}
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar-close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
}
.sidebar-title {
    color: #fff;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
}
.sidebar-content {
    padding: 1.5rem;
}
.categories-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.category-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.category-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.category-link:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
}
.category-link i {
    font-size: 0.85rem;
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.7);
}
.category-link:hover i {
    opacity: 1;
    transform: translateX(0);
}
.subcategories {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-left: 1rem;
}
.subcategory-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    padding-left: 1.5rem;
    border: 1px solid transparent;
}
.subcategory-link::before {
    content: '•';
    position: absolute;
    left: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    transition: color 0.2s ease;
}
.subcategory-link:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    padding-left: 1.75rem;
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
}
.subcategory-link:hover::before {
    color: rgba(255, 255, 255, 0.8);
}
.loading-state {
    padding: 2rem;
}
.no-categories {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
}
.no-categories i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}
.no-categories p {
    margin: 0;
    font-size: 0.95rem;
}
/* ===================================
   LOGO SECTION
   =================================== */
.logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}
.logo-link {
    display: block;
    line-height: 0;
    transition: transform 0.2s;
}
.logo-link:hover {
    transform: scale(1.05);
}

/* ===================================
   SEARCH SECTION
   =================================== */
.search-section {
    flex: 1;
    position: relative;
    max-width: 600px;
    margin: 0 2rem;
}
.search-form {
    width: 100%;
}
.search-form-inner {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    width: 100%;
}
.search-form-inner:focus-within {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}
.search-back-btn {
    background: none;
    border: none;
    color: #fff;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: 1.25rem;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
}
.search-back-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 0.875rem;
    outline: none;
    min-width: 0;
}
.search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}
.search-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s;
    min-width: 100px;
    white-space: nowrap;
}
.search-submit-btn:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2));
}
.search-icon {
    font-size: 1rem;
}
.mobile-search-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}
.mobile-search-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}
/* ===================================
   SEARCH SUGGESTIONS
   =================================== */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 0.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-height: 500px;
    overflow-y: auto;
    z-index: 100;
    border: 1px solid #eaeaea;
    width: 100%;
}
.search-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
}
.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
}
.no-results-icon {
    font-size: 3rem;
    color: #ccc;
    margin-bottom: 1rem;
}
.no-results-text {
    color: #666;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}
.suggestions-content {
    padding: 0.5rem 0;
}
.suggestion-group {
    margin-bottom: 1rem;
}
.suggestion-group:last-child {
    margin-bottom: 0;
}
.suggestion-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f8f8f8;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #555;
    border-bottom: 1px solid #eaeaea;
}
.suggestion-icon {
    font-size: 0.875rem;
}
.suggestion-list {
    list-style: none;
    padding: 0.5rem 0;
    margin: 0;
}
.suggestion-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.875rem;
    text-transform: capitalize;
    border-left: 3px solid transparent;
}
.suggestion-item:hover {
    background-color: #f8f8f8;
    border-left-color: #8b4513;
}
.suggestion-item-icon {
    color: #8b4513;
    font-size: 1rem;
    width: 16px;
    text-align: center;
}
.suggestion-item-text {
    color: #333;
}
.product-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.product-image-container,
.shop-image-container {
    flex-shrink: 0;
}
.product-img,
.shop-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #eaeaea;
}
.shop-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.product-info {
    flex: 1;
    min-width: 0;
}
.product-name {
    display: block;
    color: #333;
    text-decoration: none;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s;
}
.product-name:hover {
    color: #8b4513;
}
.product-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}
.original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 0.8rem;
}
.discounted-price {
    color: #d32f2f;
    font-weight: 600;
}
.suggestion-link {
    color: #333;
    text-decoration: none;
    display: block;
    transition: color 0.2s;
    flex: 1;
}
.suggestion-link:hover {
    color: #8b4513;
}
/* ===================================
   USER ACTIONS
   =================================== */
.user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
}
.auth-links {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
}
.auth-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: all 0.2s;
}
.auth-links:hover .auth-icon-container {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
}
.user-icon {
    font-size: 1.25rem;
    opacity: 0.9;
}
.auth-text-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.auth-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
    white-space: nowrap;
}
.auth-link:hover {
    opacity: 0.8;
}
.logout-link {
    cursor: pointer;
}
.auth-divider {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
}
.notification-container {
    position: relative;
}
.notification-btn {
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.9);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}
.notification-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
}
.v-menu__content.theme-light.menuable__content__active {
    top: 100px !important;
    position: fixed;
    min-width: 350px !important;
}
.notifications-menu {
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
}
/* ===================================
   MOBILE STYLES
   =================================== */
@media (max-width: 959px) {
    .logo-bar-container {
        padding: 1rem;
        gap: 1rem;
    }
    .search-section {
        position: fixed;
        width: 100%;
        left: 0;
        right: 0;
        top: -100%;
        background: #3d2222;
        padding: 1rem;
        z-index: 1001;
        transition: top 0.3s ease;
        margin: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        max-width: none;
    }
    .search-section.search-open {
        top: 0;
    }
    .search-form-inner {
        border-radius: 12px;
    }
    .search-suggestions {
        top: calc(100% + 1rem);
        left: 1rem;
        right: 1rem;
        width: auto;
        margin-top: 0;
    }
    .user-actions {
        display: none !important;
    }
}
@media (max-width: 768px) {
    .search-suggestions {
        top: calc(100% + 0.5rem);
    }
    .sidebar {
        width: 260px;
    }
}
@media (min-width: 960px) {
    .search-section {
        position: relative;
    }
    .sidebar {
        display: none !important;
    }
    .sidebar-overlay {
        display: none !important;
    }
}
@media (max-width: 480px) {
    .logo-img {
        height: 32px;
    }
    .logo-bar-container {
        padding: 0 0.75rem;
    }
    .search-input {
        padding: 0.75rem 0.5rem;
    }
    .search-back-btn {
        padding: 0.75rem 0.75rem;
        min-width: 44px;
    }
    .sidebar {
        width: 240px;
    }
}
</style>