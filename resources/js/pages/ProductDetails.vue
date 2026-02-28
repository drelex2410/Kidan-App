<template>
  <v-container class="pt-7">
    <v-row align="start">
      <v-col
        lg="10"
        cols="12"
        class="main-bar"
      >
        <v-row class="">
          <v-col
            cols="12"
            md="6"
            lg="5"
          >
            <ProductGallery
              :is-loading="detailsLoading"
              :gallery-imgaes="productDetails.photos"
              :selectedVariation="selectedVariation"
            />
          </v-col>
          <v-col
            md="6"
            lg="7"
          >
            <template v-if="!detailsLoading">
              <h1 class="fs-24 fw-700 mb-4 lh-1-3">{{ productDetails.name }}</h1>

              <div class="mb-3">
                <span class="opacity-60 fs-14">{{ productDetails.description.replace(/<[^>]*>?/gm, '').substring(0, 100) }}</span>
              </div>

              <div
                v-if="productDetails.is_variant == 1"
                class="mb-4"
              >
                <div class="mb-3">
                  <div class="fw-600 fs-14 mb-2">Select Size</div>
                  <div class="d-flex gap-2">
                    <label
                      v-for="(variation_option, i) in productDetails.variation_options"
                      :key="i"
                      v-if="variation_option.name.toLowerCase() === 'size'"
                    >
                      <label
                        v-for="(value, j) in variation_option.values"
                        :key="j"
                        class="size-option me-2"
                      >
                        <input
                          v-model="chooseOptions[i]"
                          type="radio"
                          :name="`option_${variation_option.id}`"
                          :value="variation_option.id + ':' + value.id"
                          @change="optionChosen"
                          class="d-none"
                        />
                        <span class="size-label">{{ value.name }}</span>
                      </label>
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="fw-600 fs-14 mb-2">Select Color</div>
                  <div class="d-flex gap-2">
                    <label
                      v-for="(variation_option, i) in productDetails.variation_options"
                      :key="i"
                      v-if="variation_option.name.toLowerCase() === 'color'"
                    >
                      <label
                        v-for="(value, j) in variation_option.values"
                        :key="j"
                        class="color-option me-2"
                      >
                        <input
                          v-model="chooseOptions[i]"
                          type="radio"
                          :name="`option_${variation_option.id}`"
                          :value="variation_option.id + ':' + value.id"
                          @change="optionChosen"
                          class="d-none"
                        />
                        <span 
                          class="color-swatch"
                          :style="{backgroundColor: value.name}"
                        ></span>
                      </label>
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex align-center">
                  <template v-if="discount > 0">
                    <span class="primary-text fs-28 fw-700 me-3">{{ format_price(productDetails.base_discounted_price) }}</span>
                  </template>
                  <template v-else>
                    <span class="primary-text fs-28 fw-700 me-3">{{ format_price(productDetails.base_price) }}</span>
                  </template>
                </div>
              </div>

              <div class="mb-4">
                <v-btn
                  v-if="Number.isInteger(cartQuantity)"
                  color="grey-darken-4 white-text"
                  elevation="0"
                  size="large"
                  block
                  class="text-uppercase fw-600"
                  @click="addCart"
                >Add to Cart</v-btn>
              </div>

              <div class="mb-4">
                <v-btn
                  v-if="Number.isInteger(cartQuantity)"
                  variant="outlined"
                  color="grey-darken-4"
                  size="large"
                  block
                  class="text-uppercase fw-600"
                  @click="buyNow"
                >Purchase Now</v-btn>
              </div>

              <div class="details-section">
                <div class="details-item border-top pt-3 pb-3">
                  <div class="fw-600 fs-14 mb-2">Details</div>
                  <div class="fs-13 opacity-70" v-html="productDetails.description"></div>
                </div>

                <div class="details-item border-top pt-3 pb-3">
                  <div class="fw-600 fs-14 mb-2">Shipping & Returns</div>
                  <div class="fs-13 opacity-70">
                    <div v-if="!productDetails.is_digital">
                      <div
                        v-if="Math.ceil(productDetails.express_delivery_time / 24) == Math.ceil(productDetails.standard_delivery_time / 24)"
                      >
                        Estimated delivery: {{ Math.ceil(productDetails.express_delivery_time / 24) }} days
                      </div>
                      <div v-else>
                        Estimated delivery: {{ Math.ceil(productDetails.express_delivery_time / 24) }} - {{ Math.ceil(productDetails.standard_delivery_time / 24) }} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </template>
          </v-col>
        </v-row>

        <div class="mt-8">
          <v-expansion-panels
            v-model="panel"
            class="product-details-expansion"
            flat
            multiple
          >
            <v-expansion-panel class="mb-3">
              <v-expansion-panel-title collapse-icon="las la-arrow-circle-right" expand-icon="las la-arrow-circle-right">
                <div class="d-flex align-center">
                  <span class="fs-16 fw-600">{{ $t("rating__reviews") }}</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="">
                <ProductReviews
                  :id="productDetails.id"
                  :is-loading="detailsLoading"
                  :review-summary="reviewSummary"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <div
          v-if="boughtTogetherProducts.length > 0"
          class="mb-5 mt-8"
        >
          <h2 class="mb-3 fs-21 opacity-80">
            {{ $t("frequently_bought_together") }}
          </h2>
          <swiper
            :slides-per-view="carouselOption.slidesPerView"
            :space-between="carouselOption.spaceBetween"
            :breakpoints="carouselOption.breakpoints"
          >
            <swiper-slide
              v-for="(product, i) in boughtTogetherProducts"
              :key="i"
              class=""
            >
              <product-box
                :product-details="product"
                :is-loading="togetherLoading"
              />
            </swiper-slide>
          </swiper>
        </div>

        <div class="mb-5">
          <h2 class="mb-3 fs-21 opacity-80">
            {{ $t("more_items_to_explore") }}
          </h2>
          <swiper
            :slides-per-view="carouselOption.slidesPerView"
            :space-between="carouselOption.spaceBetween"
            :breakpoints="carouselOption.breakpoints"
          >
            <swiper-slide
              v-for="(product, i) in moreProducts"
              :key="i"
              class=""
            >
              <product-box
                :product-details="product"
                :is-loading="moreLoading"
              />
            </swiper-slide>
          </swiper>
        </div>
      </v-col>

      <v-col
        lg="2"
        cols="12"
        class="sticky-top right-bar"
      >
        <v-row>
          <v-col
            lg="12"
            md="3"
            sm="4"
            cols="12"
          >
            <div class="mb-4">
              <div class="mb-3 fw-600 fs-14">Related Items</div>
              <v-row class="row-cols-2 row-cols-md-3 row-cols-lg-1 gutters-10">
                <v-col
                  v-for="(product, i) in relatedProducts"
                  :key="i"
                  class="py-2"
                >
                  <product-box
                    :product-details="product"
                    :is-loading="relatedLoading"
                    box-style="two"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import ProductReviews from "../components/product/ProductReviews.vue";
import ProductGallery from "../components/product/ProductGallery.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useHead } from "@unhead/vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  data: () => ({
    isBuyNow: false,
    cartQuantity: 1,
    chooseOptions: [],
    stock: 1,
    current_stock: 0,
    selectedVariation: {},
    minCartLimit: 1,
    maxCartLimit: Infinity,
    metaTitle: "",
    metaDescription: "",
    detailsLoading: true,
    productDetails: {},
    reviewSummary: { average: 0 },
    relatedLoading: true,
    relatedProducts: [{}, {}, {}, {}, {}],
    togetherLoading: true,
    boughtTogetherProducts: [{}, {}, {}, {}, {}],
    moreLoading: true,
    moreProducts: [{}, {}, {}, {}, {}],
    panel: [0],
    carouselOption: {
      slidesPerView: 5,
      spaceBetween: 20,
      breakpoints: {
        0: {
          slidesPerView: 2,
          spaceBetween: 12,
        },
        599: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        960: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1264: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        1904: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
      },
    },
  }),
  components: {
    ProductReviews,
    ProductGallery,
    Swiper,
    SwiperSlide,
  },
  computed: {
    ...mapGetters("app", ["generalSettings"]),
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
    ...mapGetters("wishlist", ["isThisWishlisted"]),
    ...mapGetters("cart", ["isThisInCart", "findCartItemByVariationId"]),
    ...mapGetters("affiliate", [
      "getUserReferralCode",
      "isAffiliatedUser",
      "getAffiliateOption",
    ]),
    discount() {
      return this.discount_percent(
        this.productDetails.base_price,
        this.productDetails.base_discounted_price
      );
    },
  },
  watch: {
    metaTitle(newTitle) {
      this.updateHead(newTitle, this.metaDescription);
    },
    metaDescription(newDescription) {
      this.updateHead(this.metaTitle, newDescription);
    },
    productDetails: {
      immediate: true,
      handler(newVal, oldVal) {
        if (!this.is_empty_obj(newVal)) {
          this.cartQuantity = 1;
          this.stock = newVal.stock;
          this.current_stock = newVal.current_stock;
          this.maxCartLimit = newVal.max_qty > 0 ? newVal.max_qty : Infinity;
          this.minCartLimit = newVal.min_qty;
          this.selectedVariation =
            newVal.is_variant == 1 ? {} : newVal.variations[0];
          this.chooseOptions = [];
        }
      },
    },
  },
  methods: {
    ...mapActions("recentlyViewed", ["addNewRecentlyViewedProduct"]),
    ...mapActions("affiliate", ["fetchAffiliatedUser"]),
    ...mapActions("wishlist", ["addNewWishlist", "removeFromWishlist"]),
    ...mapActions("cart", ["addToCart", "updateQuantity"]),
    ...mapActions("auth", ["showConversationDialog"]),
    ...mapMutations("auth", ["updateChatWindow", "showAddToCartDialog"]),
    async getDetails() {
      const res = await this.call_api(
        "get",
        `product/details/${this.$route.params.slug}`
      );
      if (res.data.success) {
        this.metaTitle = res.data.data.metaTitle;
        this.metaDescription = res.data.data.description.replace(/<[^>]*>?/gm, '');
        this.productDetails = res.data.data;
        this.reviewSummary = this.productDetails.review_summary;

        this.getRelatedProducts(this.productDetails.id);
        this.getBoughtTogetherProducts(this.productDetails.id);
        this.getMoreProducts(this.productDetails.id);
        this.addNewRecentlyViewedProduct(this.productDetails.id);
      } else {
        this.snack({
          message: res.data.message,
          color: "red",
        });
        this.$router.push({ name: "404" });
      }
      this.detailsLoading = false;
    },
    async getRelatedProducts(id) {
      const res = await this.call_api("get", `product/related/${id}`);
      if (res.data.success) {
        this.relatedProducts = res.data.data;
        this.relatedLoading = false;
      }
    },
    async getBoughtTogetherProducts(id) {
      const res = await this.call_api("get", `product/bought-together/${id}`);
      if (res.data.success) {
        this.boughtTogetherProducts = res.data.data;
        this.togetherLoading = false;
      }
    },
    async getMoreProducts(id) {
      const res = await this.call_api("get", `product/random/10/${id}`);
      if (res.data.success) {
        this.moreProducts = res.data.data;
        this.moreLoading = false;
      }
    },
    async productReferralCode(product_referral_code) {
      const res = await this.call_api("post", "product-refferal-code", {
        product_referral_code: product_referral_code,
        slug: this.$route.params.slug,
      });
    },
    updateHead(title, description) {
      useHead({
        title: title,
        meta: [{ name: "description", content: description }],
      });
    },
    addCart() {
      if (this.isAuthenticated && this.currentUser.user_type != "customer") {
        this.snack({
          message: this.$i18n.t(
            "please_login_as_a_customer_first_to_add_product_to_the_cart"
          ),
          color: "red",
        });
        return;
      }
      if (this.productDetails.is_variant == 1) {
        let chooseOptions = this.chooseOptions.filter((el) => el != "");
        if (
          this.productDetails.variation_options.length > chooseOptions.length
        ) {
          this.snack({
            message: this.$i18n.t("please_select_all_options"),
            color: "red",
          });
          return;
        }
      }

      if (!this.stock) {
        this.snack({
          message: this.$i18n.t("this_product_is_out_of_stock"),
          color: "red",
        });
        return;
      }

      if (
        this.selectedVariation.current_stock != null &&
        this.selectedVariation.current_stock < this.cartQuantity
      ) {
        this.snack({
          message: this.$i18n.t("this_product_is_out_of_stock"),
          color: "red",
        });
        return;
      }
      if (
        this.selectedVariation.current_stock != null &&
        this.selectedVariation.current_stock < this.productDetails.min_qty
      ) {
        this.snack({
          message: this.$i18n.t("this_product_is_out_of_stock"),
          color: "red",
        });
        return;
      }

      let minMaxCheck = this.checkMinMaxLimit(this.selectedVariation.id);
      if (!minMaxCheck.success) {
        let message =
          minMaxCheck.type == "min_limit"
            ? `${this.$i18n.t("you_need_to_purchase_minimum_quantity")} ${
                this.minCartLimit
              }.`
            : `${this.$i18n.t("you_can_purchase_maximum_quantity")} ${
                this.maxCartLimit
              }.`;

        this.snack({
          message: message,
          color: "red",
        });
        return;
      }

      this.addToCart({
        variation_id: this.selectedVariation.id,
        qty: this.cartQuantity,
      });
      this.isBuyNow = true;
      this.snack({
        message: this.$i18n.t("product_added_to_cart"),
        color: "green",
      });
      this.showAddToCartDialog({ status: false, slug: null });
    },
    buyNow() {
      this.addCart();
      if (this.isBuyNow) {
        this.$router.push({ name: "Checkout" });
      }
    },
    optionChosen() {
      let chooseOptions = this.chooseOptions.filter((el) => el != "");
      if (
        this.productDetails.variation_options.length === chooseOptions.length
      ) {
        let filteredVariations = this.productDetails.variations;

        chooseOptions.forEach((chosenOption) => {
          filteredVariations = filteredVariations.filter((variation) => {
            return variation.code.includes(chosenOption);
          });
        });

        if (filteredVariations.length == 1) {
          this.stock = filteredVariations[0].stock;
          this.current_stock = filteredVariations[0].current_stock;
          this.selectedVariation = filteredVariations[0];
        } else {
          this.selectedVariation = {};
        }
      }
    },
    checkMinMaxLimit(variation_id) {
      if (this.isThisInCart(variation_id)) {
        if (
          this.findCartItemByVariationId(variation_id).qty + this.cartQuantity <
          this.minCartLimit
        ) {
          return { success: false, type: "min_limit" };
        } else if (
          this.findCartItemByVariationId(variation_id).qty + this.cartQuantity >
          this.maxCartLimit
        ) {
          return { success: false, type: "max_limit" };
        }

        return { success: true, type: "" };
      } else {
        if (this.cartQuantity < this.minCartLimit) {
          return { success: false, type: "min_limit" };
        } else if (this.cartQuantity > this.maxCartLimit) {
          return { success: false, type: "max_limit" };
        }

        return { success: true, type: "" };
      }
    },
  },
  async created() {
    this.getDetails();
    if (this.isAuthenticated) {
      this.fetchAffiliatedUser();
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const product_referral_code = urlParams.get("product_referral_code");
    if (product_referral_code != null) {
      this.productReferralCode(product_referral_code);
    }
  },
};
</script>

<style scoped>
.size-option input[type="radio"]:checked + .size-label {
  background-color: #000;
  color: #fff;
  border-color: #000;
}

.size-label {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.size-label:hover {
  border-color: #000;
}

.color-option input[type="radio"]:checked + .color-swatch {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.color-swatch {
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.color-swatch:hover {
  box-shadow: 0 0 0 1px #000;
}

.details-section {
  border-top: 1px solid #eee;
}

.details-item {
  border-bottom: 1px solid #eee;
}

@media (max-width: 1263px) {
}
@media (min-width: 1264px) {
  .main-bar {
    max-width: calc(100% - 224px);
  }
  .right-bar {
    width: 224px;
    max-width: 224px;
  }
}
</style>