<template>
  <div class="products-section">
    <v-container class="products-container">
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
      </div>

      <div v-if="loading">
        <swiper ref="c1" :options="carouselOption" :slides-per-view="carouselOption.slidesPerView"
          :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints">
          <swiper-slide v-for="i in 8" :key="i">
            <v-skeleton-loader type="image" height="400"></v-skeleton-loader>
            <v-skeleton-loader type="text" class="mt-3"></v-skeleton-loader>
            <v-skeleton-loader type="text" width="60%"></v-skeleton-loader>
          </swiper-slide>
        </swiper>
      </div>

      <div v-else>
        <swiper ref="c2" :options="carouselOption" :slides-per-view="carouselOption.slidesPerView"
          :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints">
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
    products: [],
    carouselOption: {
      slidesPerView: 4,
      spaceBetween: 32,
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 12,
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        960: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1264: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      },
    },
  }),

  async created() {
    const res = await this.call_api("get", "setting/home/product_section_one");
    if (res.data.success) {
      this.title = res.data.data.title;
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
}
</style>