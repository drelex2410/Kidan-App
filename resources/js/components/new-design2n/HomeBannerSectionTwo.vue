<template>
    <div class="multi-banner-section">
        <div v-if="loading" class="banner-skeleton">
            <v-skeleton-loader type="image" height="500"></v-skeleton-loader>
        </div>
        <swiper v-else :slides-per-view="carouselOption.slidesPerView" :space-between="carouselOption.spaceBetween"
            :breakpoints="carouselOption.breakpoints" :loop="true" :autoplay="carouselOption.autoplay"
            :modules="modules" :pagination="{ clickable: true }" class="multi-swiper">
            <swiper-slide v-for="(banner, i) in banners" :key="i">
                <router-link :to="banner.link || '/'" class="multi-slide">
                    <div class="multi-image-wrapper">
                        <img :src="banner.img" :alt="`Banner ${i + 1}`" @error="imageFallback($event)"
                            class="multi-image" />
                        <div class="multi-overlay"></div>
                    </div>
                </router-link>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            modules: [Autoplay, Pagination],
        };
    },
    data: () => ({
        loading: true,
        banners: [],
        carouselOption: {
            slidesPerView: 2,
            spaceBetween: 20,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                599: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                960: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1264: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1904: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
            }
        },
    }),
    async created() {
        const res = await this.call_api("get", "setting/home/banner_section_two");
        if (res.data.success) {
            this.banners = res.data.data;
            this.loading = false;
        }
    }
}
</script>

<style scoped>
/* ===================================
   MULTI BANNER SECTION
   =================================== */
.multi-banner-section {
    width: 100%;
    height: 500px;
    position: relative;
    background: #f8f8f8;
    overflow: hidden;
}

.banner-skeleton {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
}

/* ===================================
   SWIPER STYLES
   =================================== */
.multi-swiper {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
}

.multi-swiper :deep(.swiper-pagination) {
    bottom: 1.5rem;
    z-index: 20;
}

.multi-swiper :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    background: #ffffff;
    opacity: 0.5;
    transition: all 0.3s ease;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.multi-swiper :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    width: 24px;
    border-radius: 4px;
    background: #ffffff;
}

/* ===================================
   MULTI SLIDE
   =================================== */
.multi-slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    text-decoration: none;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.multi-slide:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.multi-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.multi-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.multi-slide:hover .multi-image {
    transform: scale(1.06);
}

.multi-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.25) 0%,
            transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
}

.multi-slide:hover .multi-overlay {
    opacity: 1;
}

/* ===================================
   RESPONSIVE STYLES
   =================================== */
@media (max-width: 1264px) {
    .multi-banner-section {
        height: 450px;
    }

    .multi-swiper {
        padding: 0 0.75rem;
    }
}

@media (max-width: 960px) {
    .multi-banner-section {
        height: 400px;
    }
}

@media (max-width: 600px) {
    .multi-banner-section {
        height: 350px;
    }

    .multi-swiper {
        padding: 0 0.5rem;
    }

    .multi-swiper :deep(.swiper-pagination) {
        bottom: 1rem;
    }

    .multi-slide {
        border-radius: 10px;
    }
}

@media (max-width: 400px) {
    .multi-banner-section {
        height: 300px;
    }

    .multi-swiper :deep(.swiper-pagination-bullet) {
        width: 6px;
        height: 6px;
    }

    .multi-swiper :deep(.swiper-pagination-bullet-active) {
        width: 18px;
    }
}
</style>