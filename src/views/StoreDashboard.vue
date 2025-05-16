<template>
  <v-container>
    <v-card
      class="pa-6"
      elevation="2"
      outlined
      color="#f9f9f9"
      rounded="lg"
    >
      <v-row align="center" justify="space-between" class="mb-6">
        <v-col cols="12" md="6">
          <h2 class="text-h5 font-weight-bold">รายการสินค้าทั้งหมด</h2>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <v-btn
            @click="handleManage"
            color="success"
            dark
            elevation="3"
            class="text-subtitle-1"
          >
            จัดการสินค้า
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <productcard />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import productcard from "../components/productcard.vue";

export default {
  components: {
    productcard,
  },
  methods: {
    handleManage() {
      this.$router.push("/manageproduct");
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease;
}
.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
