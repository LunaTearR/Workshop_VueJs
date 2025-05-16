<template>
  <v-container class="green-theme py-6">
    <v-card elevation="4" class="pa-4">
      <v-row justify="space-between" align="center" class="mb-4">
        <v-col cols="auto" class="text-center">
          <h2 class="text-h5 font-weight-bold">
            ตะกร้าสินค้าของ {{ this.user.firstName }} {{ this.user.lastName }}
          </h2>
        </v-col>
      </v-row>

      <v-simple-table>
        <thead>
          <tr>
            <th>สินค้า</th>
            <th>ราคา</th>
            <th>จำนวน</th>
            <th>รวม</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cart?.length === 0">
            <td colspan="5" class="text-center text-grey--text">
              ไม่พบสินค้าในตะกร้า
            </td>
          </tr>
          <tr v-for="item in cart" :key="item._id">
            <td>{{ item.name }}</td>
            <td>฿{{ item.price }}</td>
            <td>
              <v-btn icon small color="success" @click="updateQty(item, -1)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-2">{{ item.quantity }}</span>
              <v-btn icon small color="success" @click="updateQty(item, 1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </td>
            <td>฿{{ item.price * item.quantity }}</td>
            <td>
              <v-btn icon small color="red" @click="confirmRemove(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <div class="text-right mt-4">
        <v-chip color="green lighten-2" class="pa-4 white--text">
          <strong>รวมทั้งหมด: ฿{{ total }}</strong>
        </v-chip>
      </div>

      <div class="text-right mt-4">
        <v-btn
          color="success"
          @click="addToOrder()"
          :disabled="cart.length === 0"
        >
          <v-icon left>mdi-cart-check</v-icon>
          ยืนยันการสั่งซื้อ
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      user: {},
    };
  },
  computed: {
    cart() {
      return this.$store.getters.cartItems || [];
    },
    total() {
      return this.cart?.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  created() {
    this.getToken();
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = JSON.parse(localStorage.getItem("user"));
    },
    updateQty(item, delta) {
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        this.confirmRemove(item);
      } else {
        item.quantity = newQty;
        this.$store.commit("setCart", this.cart);
      }
    },
    confirmRemove(item) {
      if (confirm("คุณแน่ใจแล้วใช่ไหมที่จะลบสินค้าออกจากตะกร้า?")) {
        this.remove(item);
      }
    },
    remove(item) {
      this.$store.commit("removeFromCart", item._id);
    },
    async addToOrder() {
      try {
        for (const item of this.cart) {
          await this.axios.post(
            `http://localhost:3000/api/v1/products/${item._id}/orders`,
            { quantity: item.quantity },
            {
              headers: {
                Authorization: `${this.token}`,
              },
            }
          );
        }
        this.$store.commit("setCart", []);
        alert("ทำรายการสั่งซื้อเรียบร้อยแล้ว");
      } catch (error) {
        console.error("สั่งซื้อไม่สำเร็จ:", error);
        alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
      }
    },
    getToken() {
      this.token = localStorage.getItem("token");
    },
  },
};
</script>

<style scoped>
.green-theme {
  background-color: #f0fdf4;
}

.v-simple-table th {
  background-color: #c8e6c9;
  color: #2e7d32;
  text-align: center;
}

.v-simple-table td {
  text-align: center;
}
</style>
