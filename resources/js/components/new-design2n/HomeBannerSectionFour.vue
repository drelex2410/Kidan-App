<template>
    <div class="quad-banner-section">
        <div v-if="loading" class="banner-skeleton">
            <v-skeleton-loader type="image" height="500"></v-skeleton-loader>
        </div>
        <swiper v-else :slides-per-view="carouselOption.slidesPerView" :space-between="carouselOption.spaceBetween"
            :breakpoints="carouselOption.breakpoints" :loop="true" :autoplay="carouselOption.autoplay"
            :modules="modules" :pagination="{ clickable: true }" class="quad-swiper">
            <swiper-slide v-for="(banner, i) in banners" :key="i">
                <router-link :to="banner.link || '/'" class="quad-slide">
                    <div class="quad-image-wrapper">
                        <img :src="banner.img" :alt="`Banner ${i + 1}`" @error="imageFallback($event)"
                            class="quad-image" />
                        <div class="quad-overlay"></div>
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
            slidesPerView: 4,
            spaceBetween: 20,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
                599: {
                    slidesPerView: 2,
                    spaceBetween: 0
                },
                960: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                1264: {
                    slidesPerView: 4,
                    spaceBetween: 20
                },
                1904: {
                    slidesPerView: 4,
                    spaceBetween: 20
                },
            }
        },
    }),
    async created() {
        const res = await this.call_api("get", "setting/home/banner_section_four");
        if (res.data.success) {
            this.banners = res.data.data;
            this.loading = false;
        }
    }
}
</script>

<style scoped>
/* ===================================
   QUAD BANNER SECTION
   =================================== */
.quad-banner-section {
    width: 100%;
    height: 500px;
    position: relative;
    background: #f8f8f8;
    margin: 2rem 0;
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
.quad-swiper {
    width: 100%;
    height: 100%;
    padding: 0 1rem;
}

.quad-swiper :deep(.swiper-pagination) {
    bottom: 1rem;
    z-index: 20;
}

.quad-swiper :deep(.swiper-pagination-bullet) {
    width: 7px;
    height: 7px;
    background: #ffffff;
    opacity: 0.5;
    transition: all 0.3s ease;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
}

.quad-swiper :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    width: 20px;
    border-radius: 4px;
    background: #ffffff;
}

/* ===================================
   QUAD SLIDE
   =================================== */
.quad-slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    text-decoration: none;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.quad-slide:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.quad-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.quad-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.quad-slide:hover .quad-image {
    transform: scale(1.07);
}

.quad-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.28) 0%,
            transparent 65%);
    opacity: 0;
    transition: opacity 0.4s ease;
}

.quad-slide:hover .quad-overlay {
    opacity: 1;
}

/* ===================================
   RESPONSIVE STYLES
   =================================== */
@media (max-width: 1264px) {
    .quad-banner-section {
        height: 450px;
    }

    .quad-swiper {
        padding: 0 0.75rem;
    }
}

@media (max-width: 960px) {
    .quad-banner-section {
        height: 400px;
        margin: 1.5rem 0;
    }

    .quad-slide {
        border-radius: 8px;
    }
}

@media (max-width: 600px) {
    .quad-banner-section {
        height: 350px;
        margin: 1rem 0;
    }

    .quad-swiper {
        padding: 0 0.5rem;
    }

    .quad-swiper :deep(.swiper-pagination) {
        bottom: 0.75rem;
    }

    .quad-swiper :deep(.swiper-pagination-bullet) {
        width: 6px;
        height: 6px;
    }

    .quad-swiper :deep(.swiper-pagination-bullet-active) {
        width: 16px;
    }
}

@media (max-width: 400px) {
    .quad-banner-section {
        height: 300px;
    }

    .quad-swiper :deep(.swiper-pagination-bullet) {
        width: 5px;
        height: 5px;
    }

    .quad-swiper :deep(.swiper-pagination-bullet-active) {
        width: 14px;
    }
}
</style>