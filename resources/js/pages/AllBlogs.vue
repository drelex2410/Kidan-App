<template>
  <div>
    <v-container fluid class="pt-0 all-blogs px-0">
      <!-- Filter Drawer (unchanged) -->
      <div :class="['border-end filter-drawer', {'open c-scrollbar overflow-y-auto z-1020':filterDrawerOpen}]">
        <div class="border-bottom pa-5 d-flex align-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M20,5H18.829a3,3,0,0,0-5.659,0H4A1,1,0,0,0,4,7h9.171a3,3,0,0,0,5.659,0H20a1,1,0,0,0,0-2ZM16,7a1,1,0,1,0-1-1A1,1,0,0,0,16,7ZM3,12a1,1,0,0,1,1-1H5.171a3,3,0,0,1,5.659,0H20a1,1,0,0,1,0,2H10.829a3,3,0,0,1-5.659,0H4A1,1,0,0,1,3,12Zm5,1a1,1,0,1,0-1-1A1,1,0,0,0,8,13ZM4,17a1,1,0,0,0,0,2h9.171a3,3,0,0,0,5.659,0H20a1,1,0,0,0,0-2H18.829a3,3,0,0,0-5.659,0Zm13,1a1,1,0,1,1-1-1A1,1,0,0,1,17,18Z" transform="translate(-3 -3)" fill="#2a2e34" fill-rule="evenodd"/>
          </svg>
          <span class="ms-4 fw-600 fs-14 lh-1">{{ $t('filters') }}</span>
          <button type="button" @click.stop="toggleFilterDrawer(false)" class="ms-auto fw-600 fs-20 lh-1">
            <i class="la la-close fs-20"></i>
          </button>
        </div>
        <div class="pa-5">
          <div class="mb-5">
            <v-form class="border rounded-pill" @submit.stop.prevent="search()">
              <v-row align="center" dense>
                <v-col>
                  <v-text-field :placeholder="$t('search')" type="text" hide-details="auto" variant="plain" v-model="queryParamBlog.searchKeyword" class="border-0 px-3"></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn size="small" icon @click.stop.prevent="search()" class="me-1 shadow-none">
                    <i class="las la-search fs-18"></i>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <div class="mb-5">
            <h4 class="fw-700 fs-14 mb-4 border-bottom pb-3">{{ $t('categories') }}</h4>
            <ul class="list-unstyled ps-0">
              <li class="my-2">
                <router-link :to="{ name: 'AllBlogs'}" :class="['text-reset fs-14', {'fw-600': is_empty_obj(currentCategory) }]">
                  {{ $t('all_categories') }}
                </router-link>
              </li>
              <li v-for="(category,i) in blogCategories" :key="i" class="my-2">
                <router-link :to="{ name: 'AllBlogsFilter', params: {categorySlug: category.slug}}" :class="['text-reset fs-14', {'fw-600': currentCategory.slug === category.slug }]">
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="mb-6">
            <h4 class="fw-700 fs-14 mb-4 border-bottom pb-3">{{ $t('social_media') }}</h4>
            <div>
              <ul class="list-unstyled ps-0">
                <li class="my-2">
                  <SocialShare :title="currentPageTitle" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Banner Section -->
      <v-row no-gutters v-if="featuredBlog && !searchKeyword && !loading">
        <v-col cols="12">
          <div class="hero-banner-wrapper">
            <div class="hero-main-container">
              <!-- Left Featured Card -->
              <div class="hero-left-col">
                <div class="hero-featured-card position-relative" @click="navigateToBlog(featuredBlog)">
                  <v-img :src="featuredBlog.banner" :alt="featuredBlog.title" cover height="100%" class="hero-featured-image">
                    <div class="hero-featured-overlay"></div>
                  </v-img>
                  <div class="hero-featured-content">
                    <div class="hero-meta mb-3">
                      <span class="text-uppercase fs-11 fw-600 letter-spacing-1">{{ featuredBlog.category || 'Magazine' }}</span>
                      <span class="mx-2">•</span>
                      <span class="fs-11">{{ featuredBlog.created_at }}</span>
                    </div>
                    <h2 class="hero-title fw-700 mb-3">
                      {{ featuredBlog.title }}
                    </h2>
                    <p class="hero-author fs-13 mb-0" v-if="featuredBlog.author">
                      By {{ featuredBlog.author }}
                    </p>
                  </div>
                  <!-- Navigation Arrows -->
                  <div class="hero-nav-arrows">
                    <button class="hero-arrow hero-arrow-left" @click.stop="navigateFeatured('prev')" :disabled="currentFeaturedIndex === 0">
                      <i class="las la-arrow-left"></i>
                    </button>
                    <button class="hero-arrow hero-arrow-right" @click.stop="navigateFeatured('next')" :disabled="currentFeaturedIndex >= blogs.length - 1">
                      <i class="las la-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Right Side Scrollable Column -->
              <div class="hero-right-col d-none d-md-block">
                <div class="hero-side-scroll-container">
                  <div class="hero-side-card" v-for="(blog, index) in sideHeroBlogs" :key="index" @click="navigateToBlog(blog)">
                    <v-img :src="blog.banner" :alt="blog.title" cover height="100%" class="hero-side-image"></v-img>
                    <div class="hero-side-overlay"></div>
                    <div class="hero-side-content">
                      <div class="hero-side-meta mb-2">
                        <span class="text-uppercase fs-10 fw-600 letter-spacing-1">{{ blog.category || 'Magazine' }}</span>
                        <span class="mx-2">•</span>
                        <span class="fs-10">{{ blog.created_at }}</span>
                      </div>
                      <h3 class="hero-side-title fs-14 fw-600 mb-0">
                        {{ blog.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters v-if="loading && !searchKeyword">
        <v-col cols="12">
          <v-skeleton-loader type="image" height="500" class="mb-0"></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- Content Section Header -->
      <v-container class="py-6">
        <v-row align="center" justify="space-between">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <h2 class="fs-14 fw-600 text-uppercase letter-spacing-1">
                <span v-if="searchKeyword">{{ $t('search_results_for') }} "{{ searchKeyword }}"</span>
                <span v-else-if="!is_empty_obj(currentCategory)">{{ currentCategory.name }}</span>
                <span v-else>Find Magazines, Article & Press Releases</span>
              </h2>
            </div>
          </v-col>
          <v-col cols="auto">
            <div class="d-flex align-center">
              <span class="me-3 fs-14" v-if="!loading">{{ totalMaterials }} {{ totalMaterials === 1 ? 'Material' : 'Materials' }}</span>
              <v-btn variant="outlined" size="small" @click.stop="toggleFilterDrawer(true)" class="text-capitalize d-md-none">
                <i class="las la-filter me-2"></i>
                {{ $t('filters') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row class="mt-4" v-if="searchKeyword">
          <v-col cols="12" md="6">
            <v-form class="border rounded-pill" @submit.stop.prevent="search()">
              <v-row align="center" dense>
                <v-col>
                  <v-text-field :placeholder="$t('search')" type="text" hide-details="auto" variant="plain" v-model="queryParamBlog.searchKeyword" class="border-0 px-4"></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn size="small" icon @click.stop.prevent="search()" class="me-2">
                    <i class="las la-search fs-18"></i>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>

      <!-- Blog Grid -->
      <v-container class="pb-12">
        <v-row class="gy-6" v-if="!loading && displayBlogs.length > 0">
          <v-col v-for="(blog, i) in displayBlogs" :key="blog.id || i" cols="12" sm="6" md="4">
            <v-card class="blog-card h-100 border-0 rounded-lg overflow-hidden" elevation="0" style="transition: all 0.3s ease;" @click="navigateToBlog(blog)">
              <div class="position-relative overflow-hidden blog-image-wrapper">
                <v-img :src="blog.banner" :alt="blog.title" height="360" width="440" cover class="blog-image" style="transition: transform 0.3s ease; width: 100%; object-fit: cover;"></v-img>
                <div class="position-absolute top-0 end-0 pa-3">
                  <v-btn icon size="small" variant="flat" color="white" class="shadow" @click.stop="toggleFavorite(blog)">
                    <i :class="['lar', blog.isFavorite ? 'las la-heart' : 'la-heart']" :style="blog.isFavorite ? 'color: red;' : ''"></i>
                  </v-btn>
                </div>
              </div>
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <span class="text-uppercase fs-11 fw-600 letter-spacing-1 text-grey">{{ blog.category || 'Magazine' }}</span>
                  <span class="mx-2 text-grey">•</span>
                  <span class="fs-11 text-grey">{{ blog.created_at }}</span>
                </div>
                <h3 class="fs-16 fw-600 mb-2 blog-title-hover" style="line-height: 1.5; min-height: 48px;">
                  {{ blog.title }}
                </h3>
                <p class="fs-13 text-grey mb-3" style="line-height: 1.6;" v-if="blog.author">
                  By {{ blog.author }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="gy-6" v-if="loading">
          <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
            <v-skeleton-loader type="image, article" class="mb-4"></v-skeleton-loader>
          </v-col>
        </v-row>
        <div class="pa-8 text-center fs-18 text-grey" v-if="!loading && blogs.length === 0">
          {{ $t('no_blog_found') }}
        </div>
        <div class="text-center mt-8" v-if="totalPages > 1 && !loading">
          <v-pagination v-model="queryParamBlog.page" :length="totalPages" prev-icon="las la-angle-left" next-icon="las la-angle-right" :total-visible="7" elevation="0" @update:modelValue="pageSwitch" class="my-4"></v-pagination>
        </div>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import SocialShare from "../components/product/SocialShare.vue";
export default {
  head() {
    return {
      title: this.pageTitle,
    };
  },
  data: () => ({
    loading: true,
    searchKeyword: "",
    currentPage: 1,
    totalPages: 1,
    blogs: [],
    recentBlogs: [],
    featuredBlog: null,
    currentFeaturedIndex: 0,
    filterDrawerOpen: false,
    blogCategories: [],
    queryParamBlog: {
      page: 1,
      categorySlug: null,
      searchKeyword: "",
    },
    currentCategory: {},
    favoriteBlogs: [],
    totalMaterials: 0,
  }),
  components: {
    SocialShare,
  },
  computed: {
    displayBlogs() {
      if (this.featuredBlog && !this.searchKeyword && this.blogs.length > 3) {
        return this.blogs.filter((blog, index) => index > 2);
      }
      return this.blogs;
    },
    sideHeroBlogs() {
      if (this.blogs.length >= 3 && !this.searchKeyword) {
        return this.blogs.slice(1, 3);
      }
      return [];
    },
    pageTitle() {
      if (this.searchKeyword) {
        return `${this.$i18n.t('search_results_for')} "${this.searchKeyword}"`;
      } else if (!this.is_empty_obj(this.currentCategory)) {
        return this.currentCategory.name;
      }
      return this.$i18n.t('all_blogs');
    },
    currentPageTitle() {
      if (this.searchKeyword) {
        return `${this.$i18n.t('search_results_for')} "${this.searchKeyword}"`;
      } else if (!this.is_empty_obj(this.currentCategory)) {
        return this.currentCategory.name;
      }
      return this.$i18n.t('all_blogs');
    }
  },
  methods: {
    toggleFilterDrawer(status) {
      this.filterDrawerOpen = status;
    },
    pageSwitch(pageNumber) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: this.queryParamBlog.page,
        },
      }).catch(() => {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getBlogList({
        page: pageNumber,
      });
    },
    search() {
      this.$router.push({
        name: "SearchBlogs",
        params: this.queryParamBlog.searchKeyword.length > 0 ? { searchKeyword: this.queryParamBlog.searchKeyword } : {},
        query: { page: 1 },
      }).catch(() => {});
    },
    async getBlogCategories() {
      try {
        const res = await this.call_api("get", `all-blog-categories`);
        if (res.data.success) {
          this.blogCategories = res.data.data || [];
          this.recentBlogs = res.data.recentBlogs ? res.data.recentBlogs.data : [];
        } else {
          this.snack({
            message: this.$i18n.t("something_went_wrong"),
            color: "red",
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async getBlogList(obj) {
      this.loading = true;
      let params = { ...this.queryParamBlog, ...obj };
      let url = "all-blogs/search?";
      url += `&page=${params.page || this.queryParamBlog.page}`;
      url += params.categorySlug ? `&category_slug=${params.categorySlug}` : "";
      url += params.searchKeyword ? `&searchKeyword=${params.searchKeyword}` : "";
      try {
        const res = await this.call_api("get", url);
        if (res.data.success) {
          this.blogs = res.data.blogs.data || [];
          this.totalPages = res.data.totalPage || 1;
          this.queryParamBlog.page = res.data.currentPage || 1;
          this.currentCategory = res.data.currentCategory || {};
          this.totalMaterials = this.blogs.length;
          if (this.blogs.length > 0 && !params.searchKeyword) {
            this.currentFeaturedIndex = 0;
            this.featuredBlog = this.blogs[0];
          } else {
            this.featuredBlog = null;
          }
          this.loadFavorites();
        }
        if (params.searchKeyword && params.searchKeyword.length > 0) {
          this.searchKeyword = params.searchKeyword;
        } else {
          this.searchKeyword = "";
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        this.snack({
          message: this.$i18n.t("something_went_wrong"),
          color: "red",
        });
      }
      this.loading = false;
    },
    toggleFavorite(blog) {
      const index = this.favoriteBlogs.indexOf(blog.slug);
      if (index > -1) {
        this.favoriteBlogs.splice(index, 1);
        blog.isFavorite = false;
      } else {
        this.favoriteBlogs.push(blog.slug);
        blog.isFavorite = true;
      }
      localStorage.setItem('favoriteBlogSlugs', JSON.stringify(this.favoriteBlogs));
    },
    loadFavorites() {
      const savedFavorites = localStorage.getItem('favoriteBlogSlugs');
      if (savedFavorites) {
        this.favoriteBlogs = JSON.parse(savedFavorites);
      }
      this.blogs.forEach(blog => {
        blog.isFavorite = this.favoriteBlogs.includes(blog.slug);
      });
    },
    navigateToBlog(blog) {
      this.$router.push({ name: 'BlogDetails', params: { slug: blog.slug } });
    },
    navigateFeatured(direction) {
      if (direction === 'next' && this.currentFeaturedIndex < this.blogs.length - 1) {
        this.currentFeaturedIndex++;
      } else if (direction === 'prev' && this.currentFeaturedIndex > 0) {
        this.currentFeaturedIndex--;
      }
      this.featuredBlog = this.blogs[this.currentFeaturedIndex];
    },
  },
  watch: {
    '$route'(to, from) {
      if (to.params.categorySlug !== from.params.categorySlug || 
          to.params.searchKeyword !== from.params.searchKeyword ||
          to.query.page !== from.query.page) {
        this.queryParamBlog.categorySlug = to.params.categorySlug || null;
        this.queryParamBlog.searchKeyword = to.params.searchKeyword || "";
        this.queryParamBlog.page = to.query.page || 1;
        this.getBlogList({
          page: this.queryParamBlog.page,
          categorySlug: this.queryParamBlog.categorySlug,
          searchKeyword: this.queryParamBlog.searchKeyword,
        });
      }
    }
  },
  async created() {
    this.queryParamBlog.categorySlug = this.$route.params.categorySlug || null;
    this.queryParamBlog.searchKeyword = this.$route.params.searchKeyword || "";
    this.queryParamBlog.page = this.$route.query.page || 1;
    await this.getBlogCategories();
    await this.getBlogList({
      page: this.queryParamBlog.page,
      categorySlug: this.queryParamBlog.categorySlug,
      searchKeyword: this.queryParamBlog.searchKeyword,
    });
  },
};
</script>

<style scoped>
/* Hero Banner Styles - Matching Reference Image */
.hero-banner-wrapper {
  width: 100%;
  height: 500px;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-main-container {
  display: flex;
  width: 100%;
  height: 500px;
  gap: 0;
}

/* Left Featured Section - 60% width */
.hero-left-col {
  flex: 0 0 60%;
  height: 500px;
  position: relative;
}

.hero-featured-card {
  height: 100%;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.hero-featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 70%);
  z-index: 1;
}

.hero-featured-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px;
  color: white;
  z-index: 2;
}

.hero-meta {
  color: rgba(255,255,255,0.95);
  font-size: 11px;
}

.hero-title {
  font-size: 32px;
  line-height: 1.3;
  color: white;
  max-width: 85%;
  margin-bottom: 12px;
}

.hero-author {
  color: rgba(255,255,255,0.9);
  font-size: 13px;
}

/* Navigation Arrows */
.hero-nav-arrows {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 3;
}

.hero-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.hero-arrow:hover:not(:disabled) {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.hero-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Right Side Scrollable Column - 40% width */
.hero-right-col {
  flex: 0 0 40%;
  height: 500px;
  overflow: hidden;
}

.hero-side-scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  scroll-behavior: smooth;
}

/* Custom scrollbar for side container */
.hero-side-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.hero-side-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.hero-side-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.hero-side-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.hero-side-card {
  position: relative;
  height: 250px;
  min-height: 250px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.hero-side-card:hover {
  transform: scale(1.02);
  z-index: 2;
}

.hero-side-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-side-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
  z-index: 1;
}

.hero-side-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  color: white;
  z-index: 2;
}

.hero-side-meta {
  color: rgba(255,255,255,0.95);
  font-size: 10px;
  margin-bottom: 8px;
}

.hero-side-title {
  color: white;
  line-height: 1.4;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Utility Classes */
.letter-spacing-1 {
  letter-spacing: 1px;
}

/* Blog Card Styles */
.blog-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.blog-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
  transform: translateY(-4px);
}

.blog-card:hover .blog-image {
  transform: scale(1.05);
}

.blog-image-wrapper {
  overflow: hidden;
}

.blog-title-hover:hover {
  color: #1976d2;
}

/* Filter Drawer */
.filter-drawer {
  position: fixed;
  width: 350px;
  max-width: 100vw;
  height: 100vh;
  visibility: hidden;
  right: -350px;
  top: 0;
  bottom: 0;
  background: #FFFBF3;
  z-index: 1020;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.16);
  transition: all 0.3s;
}

.filter-drawer.open {
  right: 0;
  visibility: visible;
}

.text-grey {
  color: #666;
}

/* Responsive Styles */
@media (max-width: 960px) {
  .hero-banner-wrapper {
    height: 450px;
  }
  
  .hero-main-container {
    height: 450px;
  }
  
  .hero-left-col {
    flex: 0 0 100%;
    height: 450px;
  }
  
  .hero-featured-card {
    height: 450px;
  }
  
  .hero-title {
    font-size: 26px;
  }
  
  .hero-featured-content {
    padding: 30px;
  }
  
  .hero-arrow {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 600px) {
  .hero-banner-wrapper {
    height: 400px;
  }
  
  .hero-main-container {
    height: 400px;
  }
  
  .hero-left-col {
    height: 400px;
  }
  
  .hero-featured-card {
    height: 400px;
  }
  
  .hero-title {
    font-size: 20px;
    max-width: 95%;
  }
  
  .hero-featured-content {
    padding: 24px;
  }
  
  .hero-arrow {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .hero-nav-arrows {
    left: 12px;
    gap: 8px;
  }
}
</style>