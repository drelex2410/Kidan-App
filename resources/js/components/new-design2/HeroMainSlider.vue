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
          <swiper :spaceBetween="0" :centeredSlides="true" :autoplay="carouselOption.autoplay"
            :pagination="{ clickable: true }" :navigation="true" :loop="true" :modules="modules"
            class="mySwiper main-swiper">
            <swiper-slide v-for="(slider, i) in sliders.one" :key="i">
              <router-link :to="slider.link" class="slide-link">
                <div class="slide-content main-slide">
                  <div class="slide-overlay"></div>
                  <img :src="slider.img" alt="Hero Slider" />
                  <div class="slide-text-container">
                    <div class="collection-badge">EXCLUSIVE COLLECTION</div>
                    <h1 class="slide-title">
                      {{ slider.title || '' }}
                    </h1>
                    <p class="slide-subtitle">
                      {{ slider.subtitle || '' }}
                    </p>
                    <button class="btn-diagonal">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </button>
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
  background-color: #FFFBF3;
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

.gutters-0>[class*="col-"] {
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
  height: 680px;
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
  transform: scale(1.05);
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

.slide-text-container {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  z-index: 2;
  color: #ffffff;
  max-width: 600px;
  animation: fadeInLeft 1s ease-out;
}

.collection-badge {
  display: inline-block;
  background-color: #FFFBF3;
  color: #000000;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  border-radius: 2px;
}

.slide-title {
  font-size: 4.5rem;
  font-weight: 300;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  text-transform: capitalize;
}

.slide-title::first-line {
  font-weight: 400;
}

.slide-subtitle {
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  max-width: 500px;
  opacity: 0.95;
}

.btn-diagonal {
  background-color: #FFFBF3;
  color: #000000;
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.btn-diagonal:hover {
  transform: scale(1.1) rotate(45deg);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.btn-diagonal svg {
  transition: transform 0.4s ease;
}

.btn-diagonal:hover svg {
  transform: rotate(-45deg);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: all 0.3s ease;
}

.mySwiper:hover :deep(.swiper-button-next),
.mySwiper:hover :deep(.swiper-button-prev) {
  opacity: 1;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(255, 255, 255, 0.3);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 1.4rem;
  font-weight: bold;
}

:deep(.swiper-pagination) {
  bottom: 30px !important;
}

:deep(.swiper-pagination-bullet) {
  background: #FFFBF3;
  opacity: 0.5;
  width: 10px;
  height: 10px;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #FFFBF3;
  width: 30px;
  border-radius: 5px;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate(-30px, -50%);
  }

  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

/* Responsive Design */
@media (min-width: 1200px) {
  .main-swiper {
    height: 750px;
  }

  .loader {
    height: 750px !important;
  }

  .slide-title {
    font-size: 5rem;
  }

  .slide-subtitle {
    font-size: 1.2rem;
  }
}

@media (min-width: 960px) and (max-width: 1199px) {
  .main-swiper {
    height: 600px;
  }

  .loader {
    height: 600px !important;
  }

  .slide-title {
    font-size: 3.5rem;
  }

  .slide-subtitle {
    font-size: 1rem;
  }

  .btn-diagonal {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 959px) {
  .main-swiper {
    height: 550px;
  }

  .loader {
    height: 550px !important;
  }

  .slide-text-container {
    left: 5%;
    max-width: 90%;
  }

  .slide-title {
    font-size: 2.8rem;
  }

  .slide-subtitle {
    font-size: 0.95rem;
  }

  .btn-diagonal {
    width: 55px;
    height: 55px;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-swiper {
    height: 500px;
  }

  .loader {
    height: 500px !important;
  }

  .slide-text-container {
    top: 45%;
    left: 4%;
  }

  .collection-badge {
    font-size: 0.65rem;
    padding: 0.4rem 1rem;
  }

  .slide-title {
    font-size: 2.2rem;
  }

  .slide-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .btn-diagonal {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .main-swiper {
    height: 450px;
  }

  .loader {
    height: 450px !important;
  }

  .slide-text-container {
    left: 3%;
    max-width: 94%;
  }

  .collection-badge {
    font-size: 0.6rem;
    padding: 0.35rem 0.8rem;
    margin-bottom: 1rem;
  }

  .slide-title {
    font-size: 1.8rem;
  }

  .slide-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1.2rem;
  }

  .btn-diagonal {
    width: 45px;
    height: 45px;
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