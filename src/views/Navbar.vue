<template>
  <div>
    <v-app-bar app color="green lighten-1" dark flat>
      <span class="store-title" @click="goToStore()">INET Store</span>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon class="d-sm-none" @click="menuOpen = !menuOpen" />

      <div class="d-none d-sm-flex">
        <v-btn text class="nav-btn" @click="goToOrders()">
          <v-icon left>mdi-receipt</v-icon>
          Orders
        </v-btn>

        <v-btn text class="nav-btn" @click="goToCart()">
          <v-icon left>mdi-cart</v-icon>
          {{ cartCount }}
        </v-btn>

        <v-chip
          v-if="user"
          class="mx-2 mt-2"
          color="green lighten-4"
          text-color="green darken-4"
          label
          small
          @click="goToUserManagement()"
        >
          <font-awesome-icon icon="user" class="pr-2" />
          {{ user.firstName }} {{ user.lastName }}
        </v-chip>

        <v-btn color="red lighten-1" @click="logout()" class="ml-2">
          <v-icon left>mdi-logout</v-icon>
          Logout
        </v-btn>
      </div>

      <v-menu v-model="menuOpen" offset-y left class="d-sm-none">
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on"></span>
        </template>

        <v-list>
          <v-list-item @click="goToOrders()">
            <v-list-item-icon><v-icon>mdi-receipt</v-icon></v-list-item-icon>
            <v-list-item-title>Orders</v-list-item-title>
          </v-list-item>

          <v-list-item @click="goToCart()">
            <v-list-item-icon><v-icon>mdi-cart</v-icon></v-list-item-icon>
            <v-list-item-title>Cart ({{ cartCount }})</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="user" @click="goToUserManagement()">
            <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
            <v-list-item-title
              >{{ user.firstName }} {{ user.lastName }}</v-list-item-title
            >
          </v-list-item>

          <v-list-item @click="logout()">
            <v-list-item-icon
              ><v-icon color="red">mdi-logout</v-icon></v-list-item-icon
            >
            <v-list-item-title class="red--text">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      menuOpen: false,
    };
  },
  computed: {
    cartCount() {
      return this.$store.getters.cartCount;
    },
  },
  created() {
    const userData = localStorage.getItem("user");
    this.user = userData ? JSON.parse(userData) : {};
  },
  methods: {
    goToCart() {
      if (this.$route.path !== "/cart") {
        this.$router.push("/cart");
      }
    },
    goToStore() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
    goToOrders() {
      if (this.$route.path !== "/orders") {
        this.$router.push("/orders");
      }
    },
    goToUserManagement() {
      if (this.$route.path !== "/usermanagement") {
        this.$router.push("/usermanagement");
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$store.commit("clearCart");
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.store-title {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  padding-left: 10px;
}
.nav-btn {
  color: white;
  font-weight: 500;
}
</style>
