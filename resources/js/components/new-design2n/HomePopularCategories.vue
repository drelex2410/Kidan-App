<template>
  <div class="popular-categories-section">
    <v-container class="category-container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('popular_categories') }}</h2>
        <router-link
          :to="{ name: 'AllCategories' }"
          class="view-all-link"
        >
          {{ $t('view_all') }}
          <i class="las la-arrow-right"></i>
        </router-link>
      </div>
      
      <div v-if="loading" class="categories-grid">
        <div
          v-for="i in 4"
          :key="i"
          class="category-card-skeleton"
        >
          <v-skeleton-loader
            type="image"
            height="400"
          ></v-skeleton-loader>
        </div>
      </div>
      
      <div v-else class="categories-grid">
        <router-link
          v-for="(category, i) in categories.slice(0, 4)"
          :key="i"
          class="category-card"
          :to="{ name: 'Category', params: {categorySlug: category.slug}}"
        >
          <div class="category-image-wrapper">
            <img
              :src="category.banner"
              :alt="category.name"
              @error="imageFallback($event)"
              class="category-image"
            >
            <div class="category-overlay"></div>
          </div>
          <div class="category-name">{{ category.name }}</div>
        </router-link>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    categories: [],
  }),
  async created() {
    const res = await this.call_api("get", "setting/home/popular_categories");
    if (res.data.success) {
      this.categories = res.data.data.data;
      this.loading = false;
    }
  },
};
</script>

<style scoped>
/* ===================================
   SECTION STYLES
   =================================== */
.popular-categories-section {
  background: #ffffff;
  padding: 5rem 0;
  margin-top: 2rem;
}

.category-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

/* ===================================
   SECTION HEADER
   =================================== */
.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
  position: relative;
}

.section-title {
  font-size: 2rem;
  font-weight: 400;
  color: #1a1a1a;
  text-transform: capitalize;
  letter-spacing: 1px;
  margin: 0;
  text-align: center;
}

.view-all-link {
  position: absolute;
  right: 0;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid transparent;
}

.view-all-link:hover {
  border-bottom-color: #1a1a1a;
}

.view-all-link i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.view-all-link:hover i {
  transform: translateX(4px);
}

/* ===================================
   CATEGORIES GRID
   =================================== */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

/* ===================================
   CATEGORY CARD
   =================================== */
.category-card {
  position: relative;
  display: block;
  text-decoration: none;
  overflow: hidden;
  background: #f8f8f8;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.category-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 125%; /* 4:5 aspect ratio */
  overflow: hidden;
  background: #f0f0f0;
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover .category-image {
  transform: scale(1.08);
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.category-name {
  padding: 1.5rem 1rem;
  text-align: center;
  color: #1a1a1a;
  font-size: 0.9375rem;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.category-card:hover .category-name {
  background: #1a1a1a;
  color: #ffffff;
}

/* ===================================
   SKELETON LOADER
   =================================== */
.category-card-skeleton {
  background: #f8f8f8;
  overflow: hidden;
}

/* ===================================
   RESPONSIVE STYLES
   =================================== */
@media (max-width: 1264px) {
  .popular-categories-section {
    padding: 4rem 0;
  }

  .category-container {
    padding: 0 2rem;
  }

  .categories-grid {
    gap: 1.5rem;
  }

  .section-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 960px) {
  .popular-categories-section {
    padding: 3rem 0;
  }

  .section-header {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .category-name {
    padding: 1.25rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .popular-categories-section {
    padding: 2.5rem 0;
    margin-top: 1rem;
  }

  .category-container {
    padding: 0 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .view-all-link {
    position: static;
    font-size: 0.8125rem;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .category-name {
    padding: 1rem 0.75rem;
    font-size: 0.8125rem;
  }

  .category-card:hover {
    transform: translateY(-4px);
  }
}

@media (max-width: 400px) {
  .categories-grid {
    gap: 0.75rem;
  }

  .category-name {
    padding: 0.875rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>