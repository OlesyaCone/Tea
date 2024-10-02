<script>
import axios from "axios";

export default {
  props: ["tea", "cart"],
  data() {
    return {
      open: false,
      delivery: 0,
      expenditure: 0,
      arrived: false,
      hour: null,
      minutes: null,
      pages: "catalog",
    };
  },
  watch: {
    pages() {
      if (this.pages == "catalog") {
        this.$router.push({ name: "catalog" });
      } else if (this.pages == "edit") {
        this.$router.push({
          name: "edit",
        });
      } else if (this.pages == "info") {
        this.$router.push({ name: "info" });
      } else {
        this.$router.push({
          name: "catalog",
        });
      }
    },
  },
  computed: {
    badges() {
      return this.cart.length;
    },
  },
  mounted() {
    this.loadCart();
  },
  methods: {
    openCart() {
      if (this.cart.length > 0) {
        this.expenditure = this.cart.reduce((sum, tea) => sum + tea.price, 0);
        this.delivery = Math.max(...this.cart.map((tea) => tea.deliveryTime));
      } else {
        this.expenditure = 0;
        this.delivery = 0;
      }
      this.open = true;
    },

    async deleteToCart(tea) {
      try {
        const response = await axios.put("/deleteTeaFromCart", { id: tea._id });
        const updatedCart = this.cart.filter((item) => item._id !== tea._id);
        this.$emit("update-cart", updatedCart);
      } catch (error) {
        console.error("Ошибка при удалении чая из корзины:", error);
      }
    },

    async purchase() {
      try {
        if (this.cart.length === 0) {
          alert("Корзина пуста!");
          return;
        }
        await axios.put("/purchase");
        setTimeout(() => {
          let data = new Date();
          this.hour = data.getHours();
          this.minutes = data.getMinutes();
          this.arrived = true;
          this.cart = [];
          this.$emit("update-cart", this.cart);
          setTimeout(() => {
            this.arrived = false;
          }, 3000);
        }, this.delivery * 1000);
        await this.loadCart();
        this.open = false;
      } catch (error) {
        console.error("Ошибка при совершении покупки:", error);
      }
    },
    async loadCart() {
      try {
        const response = await axios.get("/loadCart");
        this.$emit("update-cart", response.data);
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      }
    },
    async handleAddToCart(item) {
      try {
        const response = await axios.put("/addTeaToCart", { id: item._id });
        this.cart.push(response.data);
        await this.loadCart();
      } catch (error) {
        console.error("Ошибка при добавлении чая в корзину:", error);
      }
    },
  },
};
</script>

<template>
  <header>
    <p id="logo">Чайный Дом</p>
    <button class="card-btn" id="cart" @click="openCart">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"
        ></path>
        <path
          d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"
        ></path>
        <path
          d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"
        ></path>
        <path
          d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"
        ></path>
      </svg>
      <span
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill badge text-bg-light"
      >
        {{ badges }}
      </span>
    </button>
    <div class="col-md-6">
      <div class="form-group">
        <select
          id="form-select"
          class="form-control mx-6"
          aria-label="Default select example"
          v-model="pages"
        >
          <option value="catalog">Каталог</option>
          <option value="edit">Редактировать</option>
          <option value="info">Информация</option>
        </select>
      </div>
    </div>
  </header>
  <router-view @add-to-cart="handleAddToCart"></router-view>
  <div class="modal" v-if="open">
    <div class="modal-content">
      <span class="close" @click="open = false">&times;</span>
      <h2>Корзина</h2>
      <ul class="list-group">
        <form @submit.prevent="purchase">
          <li class="list-group-item" v-for="tea in cart" :key="tea.id">
            <div class="d-flex justify-content-between">
              <img :src="tea.teaImage" class="img" />
              <button class="button" type="button" @click="deleteToCart(tea)">
                <svg viewBox="0 0 448 512" class="svgIcon">
                  <path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  ></path>
                </svg>
              </button>
              <div class="card-price">
                <div>
                  <p>
                    <span>Время доставки: </span>{{ tea.deliveryTime
                    }}<span>cек</span>
                  </p>
                </div>
                <div class="card-price">{{ tea.price }}<span>₽</span></div>
              </div>
            </div>
          </li>
          <div class="card-price d-flex justify-content-between">
            <div>
              <p><span>Время доставки: </span>{{ delivery }}<span>сек</span></p>
            </div>
            <div class="card-price">{{ expenditure }}<span>₽</span></div>
          </div>
          <button class="add" type="submit">
            <span class="button_top"> Купить </span>
          </button>
        </form>
      </ul>
    </div>
  </div>
  <div class="message-orange" v-if="arrived">
    <p class="message-content">Ваш заказ доставлен!</p>
    <img
      class="message-img"
      src="https://papik.pro/uploads/posts/2022-08/1661878026_30-papik-pro-p-smailiki-cherno-belie-png-31.jpg"
    />
    <div class="message-timestamp-right">
      {{ this.hour }}:{{ this.minutes }}
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap");
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400);

* {
  margin: 0;
  padding: 0;
}

header {
  width: 100%;
  height: 10vh;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

#logo {
  position: fixed;
  top: 0.6vh;
  font-size: 6vh;
  left: 1vh;
  z-index: 1000;
  color: white;
  font-family: "Cormorant Garamond", serif;
  font-weight: 400;
  font-style: normal;
}

#form-select {
  position: fixed;
  top: 2vh;
  height: 6vh;
  right: 17vh;
  z-index: 1000;
  width: 23vh;
  font-size: 3vh;
}

#cart {
  position: fixed;
  top: 2vh;
  height: 6vh;
  right: 3vh;
  z-index: 1000;
  fill: #ffffff;
  border: 2px solid #ffffff;
}

.img {
  height: 75px;
  padding-top: 8px;
}

.button {
  width: 50px;
  height: 50px;
  margin-top: 16px;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
  position: relative;
}

.svgIcon {
  width: 12px;
  transition-duration: 0.3s;
}

.svgIcon path {
  fill: white;
}

.button:hover {
  width: 140px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(255, 69, 69);
  align-items: center;
}

.button:hover .svgIcon {
  width: 50px;
  transition-duration: 0.3s;
  transform: translateY(60%);
}

.button::before {
  position: absolute;
  top: -20px;
  content: "Удалить";
  color: white;
  transition-duration: 0.3s;
  font-size: 2px;
}

.button:hover::before {
  font-size: 13px;
  opacity: 1;
  transform: translateY(30px);
  transition-duration: 0.3s;
}

.message-orange {
  position: relative;
  margin-bottom: 10px;
  margin-left: calc(100% - 240px);
  padding: 10px;
  background-color: #ffffff;
  width: 200px;
  height: 300px;
  text-align: left;
  font: 400 0.9em "Open Sans", sans-serif;
  border: 3px solid #000000;
  border-radius: 10px;
  position: fixed;
  z-index: 10;
  bottom: 3vh;
  right: 1vh;
}

.message-timestamp-right {
  position: absolute;
  font-size: 1.35em;
  font-weight: 300;
  bottom: 5px;
  right: 5px;
}

.message-content {
  font-size: 3em;
}

.message-img {
  height: 160px;
  padding-left: 7px;
}
.message-orange {
  animation: fadeOut 30s forwards;
}
</style>
