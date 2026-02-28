<template>
  <div :class="[ boxStyle == 'two' ? 'product-box-two' : boxStyle == 'three' ? 'product-box-three' : boxStyle == 'four' ? 'product-box-four' : 'product-box-one']">
    <div v-if="isLoading">
      <v-skeleton-loader
        type="image"
        :height="boxStyle == 'two' ? '70' : boxStyle == 'three' ? '180' : boxStyle == 'four' ? '160' : '320'"
      />
    </div>
    <router-link
      :to="{ name: 'ProductDetails', params: {slug: productDetails.slug}}"
      :class="['overflow-hidden lv-product-card text-decoration-none', {'border':!noBorder}]"
      v-else
    >
      <v-row
        align="center"
        no-gutters
        :class="[{'flex-nowrap': boxStyle != 'one'}]"
      >
        <v-col
          :cols="boxStyle == 'one' ? '12' : 'auto'"
          class="flex-shrink-0"
        >
          <div class="position-relative lv-image-container">
            <img
              :src="productDetails.thumbnail_image"
              :alt="productDetails.name"
              @error="imageFallback($event)"
              :class="['img-fit lv-product-image', boxStyle == 'two' ? 'size-70px' : boxStyle == 'three' ? 'size-180px' : boxStyle == 'four' ? 'size-160px' : 'h-320px' ]"
            >
            <div class="lv-wishlist-icon" @click.prevent.stop="">
              <template v-if="isThisWishlisted(productDetails.id)">
                <button
                  class="lv-icon-btn"
                  @click="removeFromWishlist(productDetails.id)"
                  type="button"
                ><i class="la la-heart"></i></button>
              </template>
              <template v-else>
                <button
                  class="lv-icon-btn"
                  @click="addNewWishlist(productDetails.id)"
                  type="button"
                ><i class="la la-heart-o"></i></button>
              </template>
            </div>
          </div>
        </v-col>
        <v-col
          :cols="boxStyle == 'one' ? '12' : null"
          class="minw-0 flex-shrink-0"
        >
          <div :class="['lv-product-details', boxStyle == 'two' ? 'py-2 px-3' : 'py-4 px-0']">
            <h5 :class="['lv-product-name', boxStyle == 'two' ? 'text-truncate fs-12 mb-1' : 'fs-15 mb-2' ]">
              {{ productDetails.name }}
            </h5>
            
            <div :class="['lv-price-container', boxStyle == 'two' ? 'fs-13' : 'fs-14']">
              <template v-if="productDetails.base_price > productDetails.base_discounted_price">
                <span class="lv-price-sale"><strong>{{ format_price(productDetails.base_discounted_price) }}</strong></span>
              </template>
              <template v-else>
                <span class="lv-price-current"><strong>{{ format_price(productDetails.base_discounted_price) }}</strong></span>
              </template>
            </div>

            <div
              v-if="generalSettings.club_point == 1 && boxStyle != 'two' &&  boxStyle != 'four'"
              class="lv-club-badge mt-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="10"
                viewBox="0 0 18 12.001"
              >
                <g
                  id="Group_23890"
                  data-name="Group 23890"
                  transform="translate(-631 -822)"
                >
                  <path
                    id="Subtraction_84"
                    data-name="Subtraction 84"
                    d="M7583,12a5.989,5.989,0,0,1-1.8-.274,7.1,7.1,0,0,0,0-11.45A5.927,5.927,0,0,1,7583,0a6,6,0,1,1,0,12Zm-1.885-.3A3.016,3.016,0,1,0,7580,11.2a6.1,6.1,0,0,0,1.113.5Z"
                    transform="translate(-6940 822)"
                    fill="#fff"
                  />
                  <path
                    id="Subtraction_85"
                    data-name="Subtraction 85"
                    d="M7581.91,10.636a4.954,4.954,0,0,1-.807-.066,7.09,7.09,0,0,0,0-9.689,4.914,4.914,0,0,1,5.717,4.844A4.916,4.916,0,0,1,7581.91,10.636Zm-2.011-.43h0a4.912,4.912,0,0,1,0-8.961,6,6,0,0,1,0,8.961Z"
                    transform="translate(-6938.91 822.274)"
                    fill="#8b6914"
                    opacity="0.7"
                  />
                  <path
                    id="Subtraction_86"
                    data-name="Subtraction 86"
                    d="M7580.277,9.049v0a7.089,7.089,0,0,0,.35-.765,1.19,1.19,0,0,0,.392-.3,1.245,1.245,0,0,0,.3-.852,1.073,1.073,0,0,0-.213-.695c-.012-.014-.023-.028-.037-.042.021-.224.031-.449.031-.67,0-.083,0-.173-.005-.275a1.875,1.875,0,0,1,.555.375,1.556,1.556,0,0,1,.362.556,1.912,1.912,0,0,1,.125.7,1.906,1.906,0,0,1-1.861,1.968Zm-1.191-.144h0a2.076,2.076,0,0,1-.269-.113,1.7,1.7,0,0,1-.643-.62,2.2,2.2,0,0,1-.316-1.047l.8-.15a1.986,1.986,0,0,0,.327.94,1.293,1.293,0,0,0,.441.371,5.917,5.917,0,0,1-.339.619Zm.7-1.6h0V5.857a3.326,3.326,0,0,1-1-.381,1.487,1.487,0,0,1-.586-.588,1.764,1.764,0,0,1-.2-.851,1.747,1.747,0,0,1,.6-1.374,1.485,1.485,0,0,1,.407-.249,5.99,5.99,0,0,1,.357.613,1.06,1.06,0,0,0-.571.947,1.022,1.022,0,0,0,.229.679,1.567,1.567,0,0,0,.771.438V4.143a6.026,6.026,0,0,1,0,3.157Zm1.37-3.352h0a1.352,1.352,0,0,0-.293-.716.988.988,0,0,0-.3-.227,7.086,7.086,0,0,0-.609-1.152h.3V2.23a2,2,0,0,1,1.1.407,1.817,1.817,0,0,1,.626,1.187l-.821.124Z"
                    transform="translate(-6936.998 822.274)"
                    fill="#fff"
                  />
                  <circle
                    id="Ellipse_666"
                    data-name="Ellipse 666"
                    cx="6"
                    cy="6"
                    r="6"
                    transform="translate(631 822)"
                    fill="#fff"
                  />
                  <circle
                    id="Ellipse_667"
                    data-name="Ellipse 667"
                    cx="4.91"
                    cy="4.91"
                    r="4.91"
                    transform="translate(632.09 823.09)"
                    fill="#8b6914"
                    opacity="0.7"
                  />
                  <path
                    id="Path_25349"
                    data-name="Path 25349"
                    d="M43.364,56.224v-.542a2.936,2.936,0,0,1-.969-.267,1.689,1.689,0,0,1-.645-.62,2.22,2.22,0,0,1-.316-1.047l.8-.15a2.016,2.016,0,0,0,.327.941,1.159,1.159,0,0,0,.8.473V52.48a3.319,3.319,0,0,1-1-.38,1.468,1.468,0,0,1-.585-.587,1.871,1.871,0,0,1,.4-2.226,2.089,2.089,0,0,1,1.192-.433v-.38h.468v.38a1.963,1.963,0,0,1,1.1.406,1.806,1.806,0,0,1,.627,1.188l-.821.124a1.36,1.36,0,0,0-.294-.718,1.083,1.083,0,0,0-.612-.329v2.292a6.312,6.312,0,0,1,.795.234,1.964,1.964,0,0,1,.605.4,1.6,1.6,0,0,1,.36.556,2.046,2.046,0,0,1-.4,2.076,1.928,1.928,0,0,1-1.36.592v.551h-.468Zm0-6.707a1.178,1.178,0,0,0-.731.371,1.1,1.1,0,0,0-.04,1.391,1.566,1.566,0,0,0,.771.437Zm.468,5.494a1.178,1.178,0,0,0,.766-.4,1.245,1.245,0,0,0,.3-.852,1.067,1.067,0,0,0-.214-.7,1.849,1.849,0,0,0-.855-.47Z"
                    transform="translate(593.424 775.651)"
                    fill="#fff"
                  />
                </g>
              </svg>
              <div class="fs-11 ms-1">{{ productDetails.earn_point }} {{ $t('points') }}</div>
            </div>

            <template v-if="!productDetails.stock && boxStyle != 'two'">
              <div class="lv-out-of-stock mt-2">{{ $t('out_of_stock') }}</div>
            </template>
          </div>
        </v-col>
      </v-row>
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  props: {
    isLoading: { type: Boolean, required: true, default: true },
    boxStyle: { type: String, default: "one" },
    noBorder: { type: Boolean, default: false },
    productDetails: { type: Object, required: true, default: {} },
  },
  data: () => ({}),
  computed: {
    ...mapGetters("app", ["generalSettings"]),
    ...mapGetters("wishlist", ["isThisWishlisted"]),
    ...mapGetters("compareList", ["isThisComparedListed"]),
    ...mapGetters("cart", ["isThisInCart", "findCartItemByVariationId"]),
    discount() {
      return this.discount_percent(
        this.$props.productDetails.base_price,
        this.$props.productDetails.base_discounted_price
      );
    },
  },
  methods: {
    ...mapActions("wishlist", ["addNewWishlist", "removeFromWishlist"]),
    ...mapActions("compareList", [
      "addNewComparedList",
      "RemoveComparedListProduct",
    ]),
    ...mapActions("cart", ["addToCart", "updateQuantity"]),
    ...mapMutations("auth", ["showAddToCartDialog"]),
    addCart() {
      if (!this.$props.productDetails.is_variant) {
        this.addToCart({
          variation_id: this.$props.productDetails.variations[0].id,
          qty: this.$props.productDetails.min_qty,
        });
      }
    },
    updateCart(type, cart_id) {
      this.updateQuantity({
        type: type,
        cart_id: cart_id,
      });
    },
  },
};
</script>

<style scoped>
.lv-product-card {
  background: #ffffff;
  transition: all 0.4s ease;
  border: none !important;
  cursor: pointer;
  display: block;
  text-decoration: none !important;
  color: inherit;
  width: 100%;
}

.lv-product-card:hover {
  transform: translateY(-2px);
  text-decoration: none !important;
}

.lv-image-container {
  position: relative;
  background: #f7f7f7;
  overflow: hidden;
  width: 100%;
}

.lv-product-image {
  transition: transform 0.8s ease;
  object-fit: cover;
  width: 100%;
  display: block;
}

.lv-image-link:hover .lv-product-image {
  transform: scale(1.03);
}

.h-320px {
  height: 320px;
  width: 100%;
}

.size-180px {
  height: 180px;
  width: 220px;
}

.size-160px {
  height: 160px;
  width: 200px;
}

.size-70px {
  height: 70px;
  width: 90px;
}

.lv-wishlist-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lv-product-card:hover .lv-wishlist-icon {
  opacity: 1;
}

.lv-icon-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1a1a1a;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lv-icon-btn:hover {
  background: #1a1a1a;
  color: #ffffff;
  transform: scale(1.1);
}

.lv-icon-btn i.la-heart {
  color: #c41e3a;
}

.lv-icon-btn:hover i.la-heart {
  color: #ffffff;
}

.lv-product-details {
  padding: 16px 0;
  width: 100%;
}

.lv-product-name {
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #1a1a1a;
  margin-bottom: 8px;
  line-height: 1.5;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lv-product-name a {
  text-decoration: none;
  transition: color 0.3s ease;
  color: inherit;
}

.lv-product-card:hover .lv-product-name {
  color: #666666;
}

.lv-price-container {
  font-family: 'Futura', 'Helvetica Neue', Arial, sans-serif;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  margin-top: 4px;
}

.lv-price-sale,
.lv-price-current {
  color: #666666;
  font-weight: 700;
}

.lv-club-badge {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid #d4af37;
  padding: 5px 10px;
  border-radius: 2px;
  color: #8b6914;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.lv-out-of-stock {
  color: #999999;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.product-box-two .lv-product-details {
  padding: 12px;
  width: 100%;
}

.product-box-two .lv-image-container {
  background: transparent;
}

.product-box-three .lv-product-details,
.product-box-four .lv-product-details {
  padding: 14px 0;
  width: 100%;
}

.product-box-one,
.product-box-two,
.product-box-three,
.product-box-four {
  width: 100%;
}

@media (max-width: 1024px) {
  .h-320px {
    height: 280px;
  }

  .size-180px {
    height: 160px;
    width: 200px;
  }

  .size-160px {
    height: 140px;
    width: 180px;
  }

  .lv-product-details {
    padding: 14px 0;
  }

  .lv-product-name {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .h-320px {
    height: 240px;
  }

  .size-180px {
    height: 140px;
    width: 180px;
  }

  .size-160px {
    height: 120px;
    width: 160px;
  }

  .size-70px {
    height: 70px;
    width: 70px;
  }

  .lv-product-details {
    padding: 12px 0;
  }
  
  .lv-wishlist-icon {
    opacity: 1;
    top: 8px;
    right: 8px;
  }

  .lv-icon-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .lv-product-name {
    font-size: 13px;
  }

  .lv-price-container {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .h-320px {
    height: 200px;
  }

  .size-180px {
    height: 120px;
    width: 160px;
  }

  .size-160px {
    height: 100px;
    width: 140px;
  }

  .size-70px {
    height: 60px;
    width: 60px;
  }

  .lv-product-details {
    padding: 10px 0;
  }

  .lv-icon-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .lv-product-name {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .lv-price-container {
    font-size: 12px;
  }

  .lv-club-badge {
    font-size: 10px;
    padding: 4px 8px;
  }
}

@media (min-width: 1440px) {
  .h-320px {
    height: 360px;
  }

  .size-180px {
    height: 200px;
    width: 240px;
  }

  .size-160px {
    height: 180px;
    width: 220px;
  }
}
</style>