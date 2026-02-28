<template>
  <div class="products-section">
    <v-container class="products-container">
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
      </div>

      <v-row class="products-row">
        <v-col cols="12" lg="3" sm="6" class="banner-col">
          <div v-if="loading">
            <v-skeleton-loader type="image" height="310" />
          </div>
          <div v-else>
            <dynamic-link :to="banner.link" append-class="banner-link">
              <img :src="banner.img" class="banner-image" alt="Banner" />
            </dynamic-link>
          </div>
        </v-col>

        <v-col cols="12" lg="9" sm="6" class="products-col">
          <div v-if="loading">
            <swiper ref="c1" :slides-per-view="carouselOption.slidesPerView"
              :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints"
              :grid="{ fill: 'row', rows: 2 }" :modules="modules">
              <swiper-slide v-for="i in 8" :key="i">
                <v-skeleton-loader type="image" height="186" />
              </swiper-slide>
            </swiper>
          </div>
          <div v-else>
            <swiper ref="c2" :slides-per-view="carouselOption.slidesPerView"
              :space-between="carouselOption.spaceBetween" :breakpoints="carouselOption.breakpoints"
              :grid="{ fill: 'row', rows: 2 }" :modules="modules">
              <swiper-slide v-for="(product, i) in products" :key="i">
                <product-box :product-details="product" :is-loading="loading" box-style="four" />
              </swiper-slide>
            </swiper>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// import required modules
import { Grid, Pagination } from 'swiper/modules';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },

  setup() {
    return {
      modules: [Grid, Pagination],
    };
  },

  data: () => ({
    loading: true,
    title: "",
    banner: {},
    products: [],
    carouselOption: {
      slidesPerView: 3,
      spaceBetween: 20,
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        599: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        960: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1264: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1904: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    },
  }),

  async created() {
    const res = await this.call_api(
      "get",
      "setting/home/product_section_six"
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
   PRODUCTS ROW
   =================================== */
.products-row {
  margin: 0 -10px;
}

.banner-col,
.products-col {
  padding: 0 10px;
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
  height: auto;
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
@media (min-width: 600px) {
  .banner-image {
    height: 420px;
  }
}

@media (min-width: 960px) {
  .banner-image {
    height: 436px;
  }
}

@media (min-width: 1264px) {
  .banner-image {
    height: 284px;
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

@media (min-width: 1904px) {
  .banner-image {
    height: 284px;
  }
}

@media (max-width: 1263px) {
  .products-section {
    padding: 4rem 0;
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

  .banner-image {
    height: auto;
  }
}
</style>