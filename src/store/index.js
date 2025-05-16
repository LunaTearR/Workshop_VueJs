import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
  },
  getters: {
    cartCount: (state) => state.cart.length,
    cartItems: (state) => state.cart,
  },
  mutations: {
    addToCart(state, product) {
      const found = state.cart.find((item) => item._id === product._id);
      if (found) {
        found.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    setCart(state, cart) {
      state.cart = cart;
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    removeFromCart(state, productId) {
      state.cart = state.cart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
});
