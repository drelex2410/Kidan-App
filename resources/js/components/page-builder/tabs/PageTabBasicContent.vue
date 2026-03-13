<template>
  <div class="tab-layout tab-layout-basic">
    <h2 v-if="tab.content_title" class="tab-heading">{{ tab.content_title }}</h2>
    <div v-if="tab.content_body" class="tab-body" v-html="tab.content_body"></div>
    <a
      v-if="tab.button_text && tab.button_link"
      class="tab-button"
      :href="tab.button_link"
    >
      {{ tab.button_text }}
    </a>
  </div>
</template>

<script>
export default {
  name: "PageTabBasicContent",
  props: {
    tab: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.tab-layout-basic {
  color: #171513;
  font-family: Candara, Calibri, "Segoe UI", sans-serif;
}

.tab-heading {
  margin: 0 0 1.1rem;
  font-size: clamp(1.9rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.15;
}

.tab-body {
  max-width: 62rem;
  font-size: clamp(1.125rem, 2.4vw, 1.5rem);
  line-height: 1.7;
}

.tab-body :deep(p) {
  margin: 0;
}

.tab-button {
  display: inline-flex;
  margin-top: 1.5rem;
  padding: 0.95rem 1.55rem;
  background: #99180d;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
