<template>
  <div>
    <v-app>
      <v-container fluid class="pa-4">
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="(item, index) in product"
            :key="index"
          >
            <v-card
              class="mx-auto my-4 product-card"
              elevation="6"
              color="green lighten-5"
              max-width="300px"
            >
              <v-img
                :src="item.image"
                height="200px"
                class="rounded-top"
                cover
              ></v-img>

              <v-card-title class="justify-center text--primary">
                {{ item.name || "กำลังโหลด..." }}
              </v-card-title>

              <v-card-text class="text-center">
                <div class="mb-2">
                  <strong class="green--text text--darken-3">ราคา:</strong>
                  {{ item.price || "กำลังโหลด..." }} ฿
                </div>
                <div>
                  <strong class="green--text text--darken-3">จำนวนสินค้าในคลัง:</strong>
                  {{ item.stock || "สินค้าหมด" }}
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-center">
                <v-btn
                  color="green darken-2"
                  dark
                  @click="addToCart(item)"
                  :disabled="item.stock <= 0"
                  class="rounded-pill"
                >
                  <v-icon left>mdi-cart-plus</v-icon>
                  {{ item.stock > 0 ? "เพิ่มลงตะกร้า" : "สินค้าหมด" }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="error" timeout="3000" color="red lighten-1" dark>
          {{ error }}
        </v-snackbar>
      </v-container>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: [],
      error: "",
    };
  },
  async created() {
    await this.getProduct();
  },
  methods: {
    async getProduct() {
      try {
        const response = await this.axios.get(
          "http://localhost:3000/api/v1/products"
        );
        this.product = response.data.data || [];
      } catch (error) {
        console.error("API error:", error);
      }
    },
    addToCart(item) {
      const product = { ...item, id: item._id };
      this.$store.commit("addToCart", product);
    },
  },
};
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease;
}
.product-card:hover {
  transform: scale(1.03);
}
.rounded-top {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>
