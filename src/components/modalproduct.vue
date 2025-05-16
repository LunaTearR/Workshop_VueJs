<template>
  <v-dialog v-model="show" max-width="600px" @click:outside="closeModal">
    <v-card>
      <v-card-title>
        <span class="headline">{{
          isEditMode ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"
        }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="ชื่อสินค้า"
                  outlined
                  required
                  :rules="[(v) => !!v || 'กรุณากรอกชื่อสินค้า']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.category"
                  label="ประเภทสินค้า"
                  outlined
                  required
                  :rules="[(v) => !!v || 'กรุณากรอกประเภทสินค้า']"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="รายละเอียดสินค้า"
                  outlined
                  required
                  :rules="[(v) => !!v || 'กรุณากรอกรายละเอียดสินค้า']"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.image"
                  label="ลิงก์ของรูปสินค้า"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="formData.price"
                  label="ราคา"
                  type="number"
                  outlined
                  required
                  :rules="[
                    (v) => !!v || 'กรุณากรอกราคา',
                    (v) => v > 0 || 'ราคาต้องมากกว่า 0',
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="formData.stock"
                  label="จำนวนในคลัง"
                  type="number"
                  required
                  outlined
                  :rules="[
                    (v) => !!v || 'กรุณากรอกจำนวนในคลัง',
                    (v) => v >= 0 || 'จำนวนต้องไม่ติดลบ',
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeModal">ยกเลิก</v-btn>
        <v-btn color="success" text @click="saveProduct" :disabled="!valid"
          >บันทึก</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ProductFormModal",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    editItem: {
      type: Object,
      default: null,
    },
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      formData: {
        name: "",
        category: "",
        description: "",
        image: "",
        price: 0,
        stock: 0,
      },
    };
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    isEditMode() {
      return this.editItem !== null;
    },
  },
  watch: {
    editItem: {
      handler(newVal) {
        if (newVal) {
          this.formData = {
            name: newVal.name,
            category: newVal.category,
            description: newVal.description,
            image: newVal.image,
            price: newVal.price,
            stock: newVal.stock,
          };
        } else {
          this.resetForm();
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit("input", false);
    },
    resetForm() {
      this.formData = {
        name: "",
        category: "",
        description: "",
        image: "",
        price: 0,
        stock: 0,
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    async saveProduct() {
      if (!this.$refs.form.validate()) return;

      try {
        if (this.isEditMode) {
          await this.updateProduct();
        } else {
          await this.addProduct();
        }

        this.$emit("product-saved");
        this.closeModal();
      } catch (error) {
        console.error("Error saving product:", error);
        this.$emit("error", error.message || "ไม่สามารถบันทึกข้อมูลได้");
      }
    },
    async addProduct() {
      const response = await this.axios.post(
        "http://localhost:3000/api/v1/products",
        this.formData,
        {
          headers: {
            Authorization: `${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Add product response:", response);
      return response;
    },
    async updateProduct() {
      const response = await this.axios.put(
        `http://localhost:3000/api/v1/products/${this.editItem._id}`,
        this.formData,
        {
          headers: {
            Authorization: `${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update product response:", response);
      return response;
    },
  },
};
</script>
<style></style>
