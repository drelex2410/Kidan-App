<template>
    <div class="blog-section" v-if="!loading && blogs.length > 0">
        <v-container class="blogs-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <h2 class="section-title">Exciting Stories on KIDAN</h2>
                </div>

                <div class="blogs-slider-container">
                    <button class="slider-arrow slider-arrow-left" @click="slideLeft"
                        :disabled="blogs.length <= visibleCount">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                    <div class="blogs-slider" ref="slider">
                        <transition-group name="slide-fade" tag="div" class="slider-transition-wrapper">
                            <div v-for="(blog, i) in visibleBlogs" :key="blog.id || blog.slug || i" class="slider-item">
                                <v-card class="blog-card" elevation="0" @click="navigateToBlog(blog.slug)">
                                    <div class="blog-link">
                                        <div class="blog-image-wrapper">
                                            <img :src="blog.banner" :alt="blog.title" class="blog-image">
                                            <div class="blog-type-badge">
                                                <span v-if="blog.type === 'video'">▶</span>
                                                <span v-else>✦</span>
                                            </div>
                                        </div>

                                        <div class="blog-content">
                                            <div class="blog-meta">
                                                <span class="blog-category">{{ blog.category }}</span>
                                                <span class="blog-date">• {{ blog.created_at }}</span>
                                            </div>
                                            <h3 class="blog-title">{{ blog.title }}</h3>
                                            <p class="blog-author" v-if="blog.author">By {{ blog.author }}</p>
                                        </div>
                                    </div>
                                </v-card>
                            </div>
                        </transition-group>
                    </div>

                    <button class="slider-arrow slider-arrow-right" @click="slideRight"
                        :disabled="blogs.length <= visibleCount">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </v-container>
    </div>

    <div class="blog-section" v-else-if="loading">
        <v-container class="blogs-container">
            <div class="content-wrapper">
                <div class="section-header">
                    <v-skeleton-loader type="heading" width="300"></v-skeleton-loader>
                </div>

                <div class="blogs-slider">
                    <div v-for="i in 6" :key="i" class="blog-skeleton">
                        <v-skeleton-loader type="image" height="300"></v-skeleton-loader>
                        <v-skeleton-loader type="text" class="mt-3"></v-skeleton-loader>
                        <v-skeleton-loader type="text" width="60%"></v-skeleton-loader>
                    </div>
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        loading: true,
        blogs: [],
        currentIndex: 0,
        visibleCount: 6,
        slideDirection: 'right'
    }),
    computed: {
        visibleBlogs() {
            if (this.blogs.length <= this.visibleCount) {
                return this.blogs;
            }

            const endIndex = this.currentIndex + this.visibleCount;
            if (endIndex <= this.blogs.length) {
                return this.blogs.slice(this.currentIndex, endIndex);
            } else {
                return [
                    ...this.blogs.slice(this.currentIndex),
                    ...this.blogs.slice(0, endIndex - this.blogs.length)
                ];
            }
        }
    },
    async created() {
        try {
            const res = await this.call_api("get", "all-blogs/search");
            if (res.data.success) {
                this.blogs = res.data.blogs.data || [];
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            this.blogs = [];
        } finally {
            this.loading = false;
        }
    },
    methods: {
        navigateToBlog(slug) {
            this.$router.push({
                name: 'BlogDetails',
                params: { slug: slug }
            });
        },
        slideLeft() {
            if (this.blogs.length <= this.visibleCount) return;

            this.slideDirection = 'left';
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.blogs.length - this.visibleCount;
            }
        },
        slideRight() {
            if (this.blogs.length <= this.visibleCount) return;

            this.slideDirection = 'right';
            this.currentIndex++;
            if (this.currentIndex > this.blogs.length - this.visibleCount) {
                this.currentIndex = 0;
            }
        }
    }
};
</script>

<style scoped>
.blog-section {
    background: #FFFBF3;
    padding: 1rem 0;
}

.blogs-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 80px;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.section-header {
    text-align: left;
    margin-bottom: 40px;
}

.section-title {
    font-size: 24px;
    font-weight: 700;
    color: #000000;
    margin: 0;
    letter-spacing: -0.5px;
    line-height: 1.2;
}

.blogs-slider-container {
    position: relative;
    display: flex;
    align-items: center;
}

.blogs-slider {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 24px;
    flex: 1;
    width: 100%;
    overflow: visible;
}

.slider-transition-wrapper {
    display: contents;
}

.slider-item {
    transition: all 0.5s ease;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.slide-fade-move {
    transition: transform 0.5s ease;
}

.slider-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #FFFBF3;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.slider-arrow:hover:not(:disabled) {
    background: #f8f8f8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #d0d0d0;
}

.slider-arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.slider-arrow-left {
    left: -64px;
}

.slider-arrow-right {
    right: -64px;
}

.slider-arrow svg {
    color: #333333;
}

.blog-skeleton {
    background: #FFFBF3;
    border-radius: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.blog-card {
    border-radius: 0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #FFFBF3;
    border: none;
    cursor: pointer;
    height: 260px;
    box-shadow: none;
}

.blog-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.blog-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.blog-image-wrapper {
    position: relative;
    width: 219px;
    height: 219px;
    overflow: hidden;
    background: #f5f5f5;
    flex-shrink: 0;
}

.blog-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card:hover .blog-image {
    transform: scale(1.08);
}

.blog-type-badge {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0, 0, 0, 0.75);
    color: #FFFBF3;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    backdrop-filter: blur(4px);
}

.blog-content {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 41px;
    height: 41px;
    overflow: hidden;
}

.blog-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    font-size: 11px;
    color: #666666;
    line-height: 1.2;
}

.blog-category {
    font-weight: 600;
    text-transform: capitalize;
    color: #000000;
    font-size: 11px;
}

.blog-date {
    color: #999999;
    font-size: 11px;
}

.blog-title {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.3;
    color: #000000;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    letter-spacing: -0.2px;
}

.blog-author {
    font-size: 11px;
    color: #666666;
    margin: 0;
    line-height: 1.2;
    display: none;
}

@media (max-width: 1400px) {
    .blogs-slider {
        grid-template-columns: repeat(5, 1fr);
    }

    .blogs-container {
        padding: 0 60px;
    }
}

@media (max-width: 1200px) {
    .blogs-slider {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    .blogs-container {
        padding: 0 48px;
    }

    .slider-arrow-left {
        left: -56px;
    }

    .slider-arrow-right {
        right: -56px;
    }
}

@media (max-width: 960px) {
    .blogs-slider {
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .blogs-container {
        padding: 0 32px;
    }

    .slider-arrow-left {
        left: -48px;
    }

    .slider-arrow-right {
        right: -48px;
    }

    .blog-section {
        padding: 60px 0 80px 0;
    }

    .blog-image-wrapper {
        width: 100%;
        height: auto;
        aspect-ratio: 219 / 219;
    }

    .blog-card {
        height: auto;
    }

    .blog-content {
        min-height: auto;
        height: auto;
        padding: 8px 0;
    }
}

@media (max-width: 768px) {
    .blogs-slider {
        grid-template-columns: repeat(2, 1fr);
    }

    .slider-arrow {
        width: 40px;
        height: 40px;
    }

    .slider-arrow svg {
        width: 20px;
        height: 20px;
    }

    .blogs-container {
        padding: 0 24px;
    }

    .section-header {
        margin-bottom: 32px;
    }
}

@media (max-width: 600px) {
    .blogs-container {
        padding: 0 16px;
    }

    .blog-section {
        padding: 48px 0 64px 0;
    }

    .blogs-slider {
        gap: 16px;
        grid-template-columns: repeat(1, 1fr);
    }

    .slider-arrow {
        display: none;
    }

    .section-title {
        font-size: 22px;
    }

    .blog-content {
        padding: 12px 0;
    }

    .section-header {
        margin-bottom: 24px;
    }

    .blog-meta {
        font-size: 12px;
        margin-bottom: 6px;
    }

    .blog-category {
        font-size: 12px;
    }

    .blog-date {
        font-size: 12px;
    }

    .blog-title {
        font-size: 14px;
        -webkit-line-clamp: 2;
    }
}
</style>