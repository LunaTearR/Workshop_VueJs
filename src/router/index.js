import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "",
    name: "",
    component: () => import("../views/Navbar.vue"),
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("../views/StoreDashboard.vue"),
      },
      {
        path: "/cart",
        name: "cart",
        component: () => import("../views/Cart.vue"),
      },
      {
        path: "/manageproduct",
        name: "manageproduct",
        component: () => import("../views/ManageProduct.vue"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("../views/OrderProduct.vue"),
        props: true,
      },
      {
        path: "/usermanagement",
        name: "usermanagement",
        component: () => import("../components/usermanagementtable.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.name === "login" || to.name === "register") {
    next();
    return;
  }

  if (token) {
    const tokenExpired = isTokenExpired(token);

    if (tokenExpired) {
      localStorage.removeItem("token");

      next({ name: "login" });
    } else {
      next();
    }
  } else {
    if (to.name !== "login") {
      next({ name: "login" });
    } else {
      next();
    }
  }
});

function isTokenExpired(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
}

export default router;
