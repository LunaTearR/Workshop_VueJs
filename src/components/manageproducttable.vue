<template>
  <v-container>
    <v-card class="pa-4 elevation-2">
      <v-row justify="space-between" align="center" class="mb-4">
        <v-col cols="auto">
          <h2 class="text-h5 font-weight-bold">รายการสินค้า</h2>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="success"
            @click="openAddModal()"
            class="text-white py-3 px-6 rounded-lg font-weight-bold"
          >
            <v-icon left>mdi-plus</v-icon>
            เพิ่มสินค้าใหม่
          </v-btn>
        </v-col>
      </v-row>

      <v-simple-table dense>
        <thead>
          <tr>
            <th class="text-left">ชื่อสินค้า</th>
            <th class="text-left">ประเภท</th>
            <th class="text-left">รายละเอียด</th>
            <th class="text-left">ราคา</th>
            <th class="text-left">จำนวนในคลัง</th>
            <th class="text-center">จัดการ</th>
            <th class="text-center">ออเดอร์สินค้า</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="product.length === 0">
            <td colspan="7" class="text-center">ไม่พบสินค้าในระบบ</td>
          </tr>
          <tr v-for="item in product" :key="item._id">
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.description }}</td>
            <td>฿ {{ item.price }}</td>
            <td>{{ item.stock }}</td>
            <td class="text-center">
              <v-btn icon color="green" @click="openEditModal(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="confirmRemove(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn icon color="green" @click="showProductOrders(item._id)">
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>

    <!-- Modal for Add/Edit -->
    <modalproduct
      v-model="showModal"
      :edit-item="currentEditItem"
      :token="token"
      @product-saved="handleProductSaved"
      @error="handleError"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSnackbar = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import modalproduct from "../components/modalproduct.vue";

export default {
  components: {
    modalproduct,
  },
  data() {
    return {
      product: [],
      token: "",
      showModal: false,
      currentEditItem: null,
      showSnackbar: false,
      snackbarMessage: "",
      snackbarColor: "green",
    };
  },
  created() {
    this.getToken();
    this.getProduct();
  },
  methods: {
    showProductOrders(productId) {
      this.$router.push({
        path: "/orders",
        query: { productId: productId },
      });
    },

    openAddModal() {
      this.currentEditItem = null;
      this.showModal = true;
    },
    openEditModal(item) {
      this.currentEditItem = item;
      this.showModal = true;
    },

    handleProductSaved() {
      const actionType = this.currentEditItem ? "อัพเดท" : "เพิ่ม";
      this.showSnackbarMessage(`${actionType}สินค้าสำเร็จ`);
      this.getProduct();
    },
    handleError(errorMessage) {
      this.showSnackbarMessage(errorMessage, "error");
    },

    confirmRemove(item) {
      if (confirm("คุณแน่ใจแล้วใช่ไหมที่จะลบสินค้า?")) {
        this.remove(item);
      }
    },
    async remove(item) {
      try {
        console.log("Removing item:", item._id);
        const response = await this.axios.delete(
          `http://localhost:3000/api/v1/products/${item._id}`,
          {
            headers: {
              Authorization: `${this.token}`,
            },
          }
        );

        console.log("Delete product successfully!", response);
        this.showSnackbarMessage("ลบสินค้าสำเร็จ");
        this.getProduct(); // Refresh the product list
      } catch (error) {
        console.error("Error deleting product:", error);
        this.showSnackbarMessage("เกิดข้อผิดพลาดในการลบสินค้า", "error");
      }
    },
    async getProduct() {
      try {
        const response = await this.axios.get(
          "http://localhost:3000/api/v1/products",
          {
            headers: {
              Authorization: `${this.token}`,
            },
          }
        );
        console.log("Products fetched:", response.data);
        this.product = response.data.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.showSnackbarMessage("ไม่สามารถดึงข้อมูลสินค้าได้", "error");
      }
    },
    getToken() {
      this.token = localStorage.getItem("token");
    },
    showSnackbarMessage(message, color = "green") {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },
  },
};
</script>

<style scoped>
.v-card {
  background-color: #f1f8f6;
}

.v-simple-table thead {
  background-color: #e8f5e9;
}

.v-btn {
  border-radius: 12px;
  font-size: 16px; /* เพิ่มขนาดตัวอักษรให้ใหญ่ขึ้น */
}

.v-btn.green {
  background-color: #4caf50;
}

.v-btn.green:hover {
  background-color: #388e3c;
}

.v-snackbar {
  background-color: #388e3c;
}
</style>
