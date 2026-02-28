<template>
  <section class="hero-main-section">
    <div class="hero-content-wrapper">
      <div class="gutters-0" v-if="loading">
        <div class="px-0">
          <v-skeleton-loader type="image" height="600" class="loader"></v-skeleton-loader>
        </div>
      </div>

      <div class="gutters-0" v-else>
        <div class="px-0">
          <swiper
            :spaceBetween="0"
            :centeredSlides="true"
            :autoplay="carouselOption.autoplay"
            :pagination="{ clickable: true }"
            :navigation="true"
            :loop="true"
            :modules="modules"
            class="mySwiper main-swiper"
          >
            <swiper-slide v-for="(slider, i) in sliders.one" :key="i">
              <router-link :to="slider.link" class="slide-link">
                <div class="slide-content main-slide">
                  <div class="slide-overlay"></div>
                  <img :src="slider.img" alt="Hero Slider" />
                  <div class="slide-text">
                    <button class="btn-primary">Shop Now</button>
                  </div>
                </div>
              </router-link>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";

export default {
  name: "HeroMainSlider",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Autoplay, Pagination, Navigation],
    };
  },
  data: () => ({
    loading: true,
    sliders: null,
    carouselOption: {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    },
  }),
  async created() {
    try {
      const res = await this.call_api("get", "setting/home/sliders");
      if (res.data.success) {
        this.sliders = res.data.data;
        this.loading = false;
        console.log("Sliders data:", this.sliders);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.hero-main-section {
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
}

.hero-content-wrapper {
  width: 100%;
  margin: 0;
}

.loader {
  height: 600px !important;
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 0 !important;
  width: 100%;
}

.gutters-0 > [class*="col-"] {
  padding: 0 !important;
}
.gutters-0 {
  margin: 0 !important;
}
.px-0 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.mySwiper {
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
}
.main-swiper {
  height: 600px;
  width: 100%;
}

.slide-link {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}
.slide-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.8s ease;
}
.slide-content:hover img {
  transform: scale(1.03);
}
.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  z-index: 1;
}
.slide-text {
  position: absolute;
  bottom: 10%;
  left: 5%;
  z-index: 2;
  color: #000000;
  animation: fadeInUp 0.8s ease-out;
  text-align: center;
  max-width: 50%;
}

.btn-primary {
  background-color: #000000;
  color: #ffffff;
  padding: 1rem 3rem;
  border: 2px solid #000000;
  border-radius: 0;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.btn-primary:hover {
  background-color: #ffffff;
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #000000;
  background: rgba(255, 255, 255, 0.5);
  width: 60px;
  height: 60px;
  border-radius: 0;
  border: 1px solid #000000;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.mySwiper:hover :deep(.swiper-button-next),
.mySwiper:hover :deep(.swiper-button-prev) {
  opacity: 1;
}
:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 1.8rem;
}
:deep(.swiper-pagination-bullet) {
  background: #000000;
  opacity: 0.5;
  width: 12px;
  height: 12px;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #000000;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1200px) {
  .main-swiper {
    height: 750px;
  }
  .loader {
    height: 750px !important;
  }
  .btn-primary {
    padding: 1.2rem 4rem;
    font-size: 1.4rem;
  }
}

@media (min-width: 960px) and (max-width: 1199px) {
  .main-swiper {
    height: 550px;
  }
  .loader {
    height: 550px !important;
  }
  .btn-primary {
    padding: 1rem 3rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 959px) {
  .main-swiper {
    height: 650px;
  }
  .loader {
    height: 650px !important;
  }
  .slide-text {
    max-width: 70%;
  }
  .btn-primary {
    padding: 0.8rem 2.5rem;
    font-size: 1rem;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-swiper {
    height: 550px;
  }
  .loader {
    height: 550px !important;
  }
  .slide-text {
    max-width: 80%;
    bottom: 5%;
    left: 3%;
  }
  .btn-primary {
    padding: 0.7rem 2rem;
    font-size: 0.9rem;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-swiper {
    height: 450px;
  }
  .loader {
    height: 450px !important;
  }
  .slide-text {
    max-width: 90%;
    padding: 1rem;
  }
  .btn-primary {
    padding: 0.6rem 1.5rem;
    font-size: 0.8rem;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

:deep(.v-container) {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}
:deep(.row) {
  margin: 0 !important;
  padding: 0 !important;
}
:deep(.col) {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
