<template>
    <div class="products-section">
        <v-container class="products-container">
            <div class="section-header">
                <h2 class="section-title">{{ title }}</h2>
            </div>

            <div v-if="loading">
                <swiper ref="c1" :slides-per-view="carouselOption.slidesPerView"
                    :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints">
                    <swiper-slide v-for="i in 8" :key="i">
                        <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
                        <v-skeleton-loader type="text" class="mt-3"></v-skeleton-loader>
                        <v-skeleton-loader type="text" width="60%"></v-skeleton-loader>
                    </swiper-slide>
                </swiper>
            </div>

            <div v-else>
                <swiper ref="c2" :slides-per-view="carouselOption.slidesPerView"
                    :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints">
                    <swiper-slide>
                        <dynamic-link :to="banner.link" append-class="banner-link">
                            <img :src="banner.img" class="banner-image" alt="Banner" />
                        </dynamic-link>
                    </swiper-slide>
                    <swiper-slide v-for="(product, i) in products" :key="i">
                        <product-box :product-details="product" :is-loading="loading" />
                    </swiper-slide>
                </swiper>
            </div>
        </v-container>
    </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
    components: {
        Swiper,
        SwiperSlide,
    },

    data: () => ({
        loading: true,
        title: "",
        banner: {},
        products: [],
        carouselOption: {
            slidesPerView: 5,
            spaceBetween: 20,
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                },
                599: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
                960: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                1264: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                1904: {
                    slidesPerView: 6,
                    spaceBetween: 20,
                },
            },
        },
    }),

    async created() {
        const res = await this.call_api(
            "get",
            "setting/home/product_section_three"
        );
        if (res.data.success) {
            this.title = res.data.data.title;
            this.banner = res.data.data.banner;
            this.products = res.data.data.products.data;
            this.loading = false;
        }
    },
};
</script>

<style scoped>
/* ===================================
   PRODUCTS SECTION
   =================================== */
.products-section {
    background: #ffffff;
    padding: 5rem 0;
    margin-bottom: 0;
}

.products-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 3rem;
}

/* ===================================
   SECTION HEADER
   =================================== */
.section-header {
    text-align: center;
    margin-bottom: 4rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 400;
    color: #1a1a1a;
    text-transform: capitalize;
    letter-spacing: 1px;
    margin: 0;
}

/* ===================================
   BANNER STYLES
   =================================== */
.banner-link {
    display: block;
    line-height: 0;
    text-decoration: none;
    color: inherit;
}

.banner-image {
    width: 100%;
    height: 333px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.banner-image:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ===================================
   RESPONSIVE STYLES
   =================================== */
@media (max-width: 1264px) {
    .products-section {
        padding: 4rem 0;
    }

    .products-container {
        padding: 0 2rem;
    }

    .section-title {
        font-size: 1.75rem;
    }

    .section-header {
        margin-bottom: 3rem;
    }

    .banner-image {
        height: 300px;
    }
}

@media (max-width: 960px) {
    .products-section {
        padding: 3rem 0;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .section-header {
        margin-bottom: 2.5rem;
    }

    .banner-image {
        height: 250px;
    }
}

@media (max-width: 600px) {
    .products-section {
        padding: 2.5rem 0;
    }

    .products-container {
        padding: 0 1rem;
    }

    .section-title {
        font-size: 1.25rem;
    }

    .section-header {
        margin-bottom: 2rem;
    }

    .banner-image {
        height: 200px;
    }
}
</style>