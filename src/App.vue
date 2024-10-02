<script>
import CreateTea from "./components/CreateTea.vue";
import Cart from "./components/Cart.vue";
import axios from "axios";
import { RouterView } from "vue-router";

axios.defaults.baseURL = "http://localhost:3005";

export default {
  components: {
    RouterView,
    CreateTea,
    Cart,
  },
  data() {
    return {
      tea: [],
      cart: [],
      name: 'App',
    };
  },
  mounted() {
    this.loadTea();
    this.loadCart();
  },
  methods: {
    async loadTea() {
      try {
        let response = await axios.get("/loadTea");
        this.tea = response.data;
      } catch (error) {
        console.log("Ошибка при загрузке чая:", error);
      }
    },
    async addTeaToCatalog(newTea) {
      try {
        let response = await axios.post("/create", newTea);
        this.tea.push(response.data);
        this.loadCart();
      } catch (error) {
        console.log("Ошибка при добавлении чая:", error);
      }
    },
    async loadCart() {
      try {
        let response = await axios.get("/loadCart");
        this.cart = response.data;
      } catch (error) {
        console.log("Ошибка при загрузке корзины:", error);
      }
    },
    async addTeaToCart(item) {
      try {
        let response = await axios.put("/addTeaToCart", { id: item._id });
        this.cart.push(item);
        item.cart = true;
        this.loadCart();
      } catch (error) {
        console.log("Добавление чая в корзину:", error);
      }
    },
    updateCart(newCart) {
      this.cart = newCart; 
    },
  },
};
</script>

<template>
  <div id="app">
    <Cart @deleteTeaToCart="deleteItem(tea.id)" :tea="tea" :cart="cart"  @update-cart="updateCart"/>
    <CreateTea @create="addTeaToCatalog" :unedited="unedited"/>
  </div>
</template>

<style></style>
