<template>
  <section class="page-section editorial-intro-section">
    <div class="editorial-intro-shell" :style="shellStyle">
      <div class="editorial-intro-copy" :class="`text-${textAlign}`" v-html="body"></div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PageEditorialIntroSection",
  props: {
    section: {
      type: Object,
      required: true,
    },
  },
  computed: {
    body() {
      return this.section.data?.content || "";
    },
    textAlign() {
      return this.section.data?.text_align || "center";
    },
    shellStyle() {
      const maxWidth = Number(this.section.data?.max_width);

      return maxWidth > 0 ? { maxWidth: `${maxWidth}px` } : {};
    },
  },
};
</script>

<style scoped>
.editorial-intro-section {
  background: var(--editorial-bg, #f5f1ea);
  padding: clamp(1.5rem, 4vw, 2.25rem) 1.25rem clamp(2rem, 4vw, 2.5rem);
}

.editorial-intro-shell {
  max-width: 1040px;
  margin: 0 auto;
}

.editorial-intro-copy {
  color: var(--editorial-ink, #13110f);
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(1.06rem, 1.9vw, 1.45rem);
  line-height: 1.85;
}

.editorial-intro-copy.text-left {
  text-align: left;
}

.editorial-intro-copy.text-center {
  text-align: center;
}

.editorial-intro-copy.text-right {
  text-align: right;
}

.editorial-intro-copy :deep(p) {
  margin: 0;
}

.editorial-intro-copy :deep(strong) {
  color: var(--editorial-ink, #13110f);
  font-weight: 700;
}

.editorial-intro-copy :deep(a) {
  color: inherit;
  text-decoration: underline;
}

@media (max-width: 599px) {
  .editorial-intro-copy {
    font-size: 1rem;
    line-height: 1.75;
  }
}
</style>
