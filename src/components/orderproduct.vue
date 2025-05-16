<template>
  <div>
    <v-container>
      <v-card class="pa-4 elevation-2">
        <v-row justify="space-between" align="center" class="mb-4">
          <v-col cols="auto">
            <h2 class="headline mb-4">
              {{
                localProductId
                  ? this.orders.length > 0
                    ? `รายการ Orders ของ ${
                        this.orders[0]?.items[0]?.product?.name || "ไม่พบสินค้า"
                      }`
                    : "ยังไม่มีรายการ Orders สำหรับสินค้านี้"
                  : "รายการ Orders ทั้งหมด"
              }}
            </h2>
          </v-col>
        </v-row>

        <v-simple-table :class="['elevation-1', 'rounded-lg']">
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>ประเภทสินค้า</th>
              <th>รายละเอียดสินค้า</th>
              <th>ราคา</th>
              <th>จำนวนที่สั่ง</th>
              <th>จำนวนสินค้าในคลัง</th>
              <th>ราคารวม</th>
              <th>ชื่อผู้สั่ง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="8" class="text-center">ไม่พบรายการที่สั่งในระบบ</td>
            </tr>
            <tr
              v-for="(item, index) in orders"
              :key="item._id"
              :class="{ 'bg-grey-lighten4': index % 2 === 0 }"
            >
              <td>{{ item.items[0]?.product?.name || "-" }}</td>
              <td>{{ item.items[0]?.product?.category || "-" }}</td>
              <td>{{ item.items[0]?.product?.description || "-" }}</td>
              <td>฿ {{ item.items[0]?.product?.price || "-" }}</td>
              <td>{{ item.items[0]?.quantity || "0" }}</td>
              <td>{{ item.items[0]?.product?.stock || "0" }}</td>
              <td>฿ {{ item.totalPrice }}</td>
              <td>{{ item.user.firstName }} {{ item.user.lastName }}</td>
              <td class="text-center">
                <v-btn icon color="green" @click="handleEditOrder(item)">
                  <font-awesome-icon icon="pen" />
                </v-btn>
                <v-btn icon color="red" @click="confirmRemove(item)">
                  <font-awesome-icon icon="trash" />
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarColor"
        :timeout="3000"
        top
        right
      >
        {{ snackbarMessage }}
      </v-snackbar>
    </v-container>

    <v-dialog v-model="editDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">แก้ไขจำนวนที่สั่ง</v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field
              v-model="editQuantity"
              label="จำนวนใหม่"
              type="number"
              :rules="[
                (v) => !!v || 'กรุณากรอกจำนวน',
                (v) => v > 0 || 'จำนวนต้องมากกว่า 0',
                (v) =>
                  v <= editProductStock ||
                  `จำนวนต้องไม่เกิน ${editProductStock} ชิ้น`,
              ]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            style="border-radius: 5%"
            color="blue darken-1"
            text
            @click="editDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            style="border-radius: 5%"
            color="green darken-1"
            text
            @click="submitEditOrder"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      token: "",
      showSnackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
      localProductId: this.productId,
      editDialog: false,
      editOrderId: null,
      editQuantity: 1,
      editProductStock: 0,
    };
  },

  props: {
    productId: {
      type: String,
      default: null,
    },
  },

  created() {
    this.localProductId = this.$route.query.productId;
    this.getToken();
    this.getOrders();
  },
  watch: {
    productId(newVal) {
      this.localProductId = newVal;
    },
  },
  methods: {
    handleError(errorMessage) {
      this.showSnackbarMessage(errorMessage, "error");
    },

    handleEditOrder(item) {
      this.editOrderId = item._id;
      this.editQuantity = item.items[0]?.quantity || 1;
      this.editDialog = true;
      this.editProductStock = item.items[0]?.product?.stock || 0;
    },

    async submitEditOrder() {
      const isValid = await this.$refs.editForm.validate();
      if (!isValid) return;

      try {
        const response = await this.axios.put(
          `http://localhost:3000/api/v1/orders/${this.editOrderId}`,
          {
            quantity: this.editQuantity,
          },
          {
            headers: {
              Authorization: `${this.token}`,
            },
          }
        );

        console.log(response);
        this.showSnackbarMessage("แก้ไขจำนวนเรียบร้อยแล้ว");
        this.editDialog = false;
        this.getOrders();
      } catch (error) {
        console.error("Error updating order:", error);
        this.showSnackbarMessage("เกิดข้อผิดพลาดในการแก้ไข", "error");
      }
    },

    confirmRemove(item) {
      if (confirm("คุณแน่ใจแล้วใช่ไหมที่จะลบรายการสินค้าที่สั่ง?")) {
        this.remove(item);
      }
    },

    async remove(item) {
      try {
        const response = await this.axios.delete(
          `http://localhost:3000/api/v1/orders/${item._id}`,
          {
            headers: {
              Authorization: `${this.token}`,
            },
          }
        );
        console.log(response);

        this.showSnackbarMessage("ลบรายการสินค้าที่สั่งสำเร็จ");
        this.getOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        this.showSnackbarMessage(
          "เกิดข้อผิดพลาดในการลบรายการสินค้าที่สั่ง",
          "error"
        );
      }
    },

    async getOrders() {
      try {
        let response;

        if (this.localProductId) {
          response = await this.axios.get(
            `http://localhost:3000/api/v1/products/${this.localProductId}/orders`,
            {
              headers: {
                Authorization: `${this.token}`,
              },
            }
          );
        } else {
          response = await this.axios.get(
            "http://localhost:3000/api/v1/orders",
            {
              headers: {
                Authorization: `${this.token}`,
              },
            }
          );
        }

        this.orders = response.data.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.showSnackbarMessage(
          "ไม่สามารถดึงข้อมูลรายการสั่งสินค้าได้",
          "error"
        );
      }
    },

    getToken() {
      this.token = localStorage.getItem("token");
    },

    showSnackbarMessage(message, color = "success") {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },
  },
};
</script>

<style scoped>
.v-simple-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.v-btn {
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.v-btn:hover {
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.v-dialog .v-card {
  border-radius: 8px;
}

.v-snackbar {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
