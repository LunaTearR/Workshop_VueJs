<template>
  <v-container class="fill-height green-bg" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="5">
        <v-card class="pa-6" elevation="10" style="background-color: #e8f5e9">
          <v-card-title class="justify-center">
            <h2 class="text-success">Register</h2>
          </v-card-title>

          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              label="First Name"
              v-model="firstName"
              outlined
              dense
              color="success"
              class="mb-3"
              :rules="[(v) => !!v || 'First name is required']"
            />

            <v-text-field
              label="Last Name"
              v-model="lastName"
              outlined
              dense
              color="success"
              class="mb-3"
              :rules="[(v) => !!v || 'Last name is required']"
            />

            <v-text-field
              label="Phone Number"
              v-model="phone"
              outlined
              dense
              color="success"
              class="mb-3"
              :rules="[
                (v) => !!v || 'Phone number is required',
                (v) => /^\d{10}$/.test(v) || 'Phone number must be 10 digits',
              ]"
            />

            <v-text-field
              label="Email"
              v-model="email"
              outlined
              dense
              color="success"
              class="mb-3"
              :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
            />

            <v-text-field
              label="Password"
              v-model="password"
              outlined
              dense
              color="success"
              class="mb-4"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :rules="[
                (v) => !!v || 'Password is required',
                (v) =>
                  v.length >= 6 || 'Password must be at least 6 characters',
              ]"
            />

            <v-alert v-if="error" type="error" dismissible class="mb-3">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" dismissible class="mb-3">
              {{ success }}
            </v-alert>

            <v-btn
              color="success"
              block
              large
              :loading="loading"
              :disabled="!isFormValid"
              @click="handleRegister"
              class="mb-3"
            >
              Register
            </v-btn>

            <v-btn
              text
              color="primary"
              block
              class="text-decoration-underline"
              @click="$router.push('/login')"
            >
              Already have an account? Login
            </v-btn>
          </v-form>
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
      firstName: "",
      lastName: "",
      phone: "",
      user: {},
      error: "",
      success: "",
      loading: false,
      isFormValid: false,
      showPassword: false,
    };
  },
  methods: {
    async handleRegister() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.error = "";
      this.success = "";

      try {
        const formData = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          phone: this.phone,
        };

        const response = await this.axios.post(
          "http://localhost:3000/api/v1/register",
          formData
        );

        this.user = response.data.user || response.data.data;
        this.success = "Registration successful! Redirecting to login...";

        setTimeout(() => {
          this.$refs.form.reset();
          this.$router.push("/login");
        }, 1500);
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.green-bg {
  background: linear-gradient(to bottom right, #a5d6a7, #c8e6c9);
  min-height: 100vh;
}
.text-decoration-underline {
  text-decoration: underline;
}
</style>
