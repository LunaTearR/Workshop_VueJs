<template>
  <v-container>
    <v-card class="pa-4 elevation-2" style="background-color: #e8f5e9">
      <v-card-title class="headline" style="color: #388e3c"
        >จัดการผู้ใช้งาน</v-card-title
      >

      <span class="subheading" style="color: #388e3c"
        >ผู้ใช้ที่ยังไม่อนุมัติ</span
      >
      <v-simple-table
        class="elevation-1 rounded-lg mt-4"
        style="background-color: #ffffff"
      >
        <thead>
          <tr style="background-color: #c8e6c9; color: #388e3c">
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>สิทธิ์</th>
            <th>สถานะ</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pendingUsers.length === 0">
            <td colspan="5" class="text-center">
              ไม่พบผู้ใช้งานที่รอการอนุมัติ
            </td>
          </tr>
          <tr v-for="user in pendingUsers" :key="user._id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>รอการอนุมัติ</td>
            <td class="text-center">
              <v-btn
                v-if="isAdmin"
                icon
                color="red"
                @click="confirmRemove(user)"
                style="margin-right: 8px; border-radius: 50%"
              >
                <font-awesome-icon icon="trash" />
              </v-btn>
              <v-btn
                v-if="isAdmin"
                icon
                color="green"
                @click="approveUser(user)"
                style="border-radius: 50%"
              >
                <font-awesome-icon icon="check" />
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <br />
      <span class="subheading" style="color: #388e3c">
        ผู้ใช้ที่อนุมัติแล้ว
      </span>
      <v-simple-table
        class="elevation-1 rounded-lg mt-4"
        style="background-color: #ffffff"
      >
        <thead>
          <tr style="background-color: #c8e6c9; color: #388e3c">
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>สิทธิ์</th>
            <th>สถานะ</th>
            <th class="text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="approvedUsers.length === 0">
            <td colspan="5" class="text-center">
              ไม่พบผู้ใช้งานที่ได้รับการอนุมัติ
            </td>
          </tr>
          <tr v-for="user in approvedUsers" :key="user._id">
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>อนุมัติแล้ว</td>
            <td class="text-center">
              <v-btn
                v-if="isAdmin && user.email !== currentUser.email"
                icon
                color="red"
                @click="confirmRemove(user)"
                style="margin-right: 8px; border-radius: 50%"
              >
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
      <template v-slot:action="{ attrs }">
        <font-awesome-icon
          icon="xmark"
          @click="showSnackbar = false"
          v-bind="attrs"
          class="px-6"
        />
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      token: "",
      showSnackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
      isAdmin: false,
      currentUser: {},
    };
  },

  created() {
    this.token = localStorage.getItem("token");
    this.getCurrentUser();
    this.getUsers();
  },

  methods: {
    getCurrentUser() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.currentUser = user;
        this.isAdmin = user.role === "admin";
      }
    },

    showUserStatus(status) {
      return status === "pending" ? "รอการอนุมัติ" : "ได้รับการอนุมัติ";
    },

    showSnackbarMessage(message, color = "success") {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },

    async approveUser(item) {
      try {
        const response = await this.axios.put(
          `http://localhost:3000/api/v1/users/${item._id}/approve`,
          {},
          {
            headers: { Authorization: this.token },
          }
        );
        console.log(response);
        this.showSnackbarMessage("อนุมัติผู้ใช้งานเรียบร้อย");
        this.getUsers();
      } catch (error) {
        console.error("Error approving user:", error);
        this.showSnackbarMessage(
          "เกิดข้อผิดพลาดในการอนุมัติผู้ใช้งาน",
          "error"
        );
      }
    },

    async getUsers() {
      try {
        const response = await this.axios.get(
          "http://localhost:3000/api/v1/users",
          {
            headers: { Authorization: this.token },
          }
        );
        this.users = response.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.showSnackbarMessage("ไม่สามารถดึงข้อมูลผู้ใช้งานได้", "error");
      }
    },

    confirmRemove(user) {
      if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานคนนี้?")) {
        this.removeUser(user);
      }
    },

    async removeUser(user) {
      try {
        await this.axios.delete(
          `http://localhost:3000/api/v1/users/${user._id}`,
          {
            headers: { Authorization: this.token },
          }
        );
        this.showSnackbarMessage("ลบผู้ใช้งานสำเร็จ");
        this.getUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        this.showSnackbarMessage("เกิดข้อผิดพลาดในการลบผู้ใช้งาน", "error");
      }
    },
  },

  computed: {
    pendingUsers() {
      return this.users.filter((user) => user.status === "pending");
    },
    approvedUsers() {
      return this.users.filter((user) => user.status === "approve");
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

.v-snackbar {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #388e3c;
  color: #ffffff;
}

.card-content {
  background-color: #e8f5e9;
}

.subheading {
  color: #388e3c;
}
</style>
