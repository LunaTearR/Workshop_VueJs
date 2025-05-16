<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-5" elevation="10" style="background-color: #e8f5e9">
          <v-card-title class="justify-center">
            <h2 class="text-success">Login</h2>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <v-text-field
                name="email"
                label="Email"
                v-model="email"
                type="email"
                color="success"
                outlined
                dense
                class="mb-4"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Invalid email format',
                ]"
              ></v-text-field>

              <v-text-field
                name="password"
                label="Password"
                v-model="password"
                type="password"
                color="success"
                outlined
                dense
                class="mb-4"
                :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 6 || 'Password must be at least 6 characters',
                ]"
              ></v-text-field>

              <v-alert v-if="error" type="error" dismissible class="mb-4">
                {{ error }}
              </v-alert>

              <v-alert v-if="success" type="success" dismissible class="mb-4">
                {{ success }}
              </v-alert>

              <v-btn
                color="success"
                dark
                block
                large
                class="mt-2"
                :loading="loading"
                @click="handleLogin"
              >
                Login
              </v-btn>

              <v-btn
                text
                color="success"
                block
                class="mt-4"
                @click="$router.push('/register')"
              >
                Don't have an account? Register
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      token: "",
      user: {},
      error: "",
      success: "",
      isFormValid: false,
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      const valid = this.$refs.form.validate();
      if (!valid) return;

      this.error = "";
      this.success = "";
      this.loading = true;

      try {
        const data = { email: this.email, password: this.password };
        const response = await this.axios.post(
          "http://localhost:3000/api/v1/login",
          data
        );

        this.token = response.data.token;
        this.user = response.data.data;
        this.setLocalStorage();

        this.success = "Login successful! Redirecting...";
        setTimeout(() => {
          this.$router.push("/");
        }, 1500);
      } catch (error) {
        this.error =
          error.response?.data?.message || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    setLocalStorage() {
      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #a5d6a7, #c8e6c9);
}
</style>
