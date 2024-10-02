<script>
import axios from "axios";
export default {
  props: ["cart", "unedited", "cart"],
  data() {
    return {
      tea: [],
      cart: [],
      teaType: "all",
      min: 0,
      max: 1000,
      open: false,
      openEdit: false,
      selectedItem: null,
      selectedItemEdit: null,
      title: "",
      minDescription: "",
      teaImage: "",
      description: "",
      price: null,
      deliveryTime: null,
      unedited: false,
    };
  },
  mounted() {
    this.loadTea();
    this.loadCart();
  },
  computed: {
    filteredTea() {
      let result = [];
      for (const item of this.tea) {
        let matches = true;

        if (this.teaType !== "all" && item.teaType !== this.teaType) {
          matches = false;
        }

        if (item.price <= this.min || item.price >= this.max) {
          matches = false;
        }

        if (matches) {
          result.push(item);
        }
      }
      return result;
    },
  },
  methods: {
    openModal(item) {
      this.selectedItem = item;
      this.open = true;
    },
    addToCart(item) {
      this.$emit("add-to-cart", item);
    },
    async loadTea() {
      try {
        const response = await axios.get("/teas");
        this.tea = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке чая:", error);
      }
    },
    async loadCart() {
      try {
        const response = await axios.get("/loadCart");
        this.cart = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      }
    },
  },
};
</script>

<template>
  <div class="container layout">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="teaType">Вид чая</label>
          <select
            class="form-select form-control teaType"
            aria-label="Default select example"
            v-model="teaType"
          >
            <option value="all">Все виды</option>
            <option value="black">Чёрный чай</option>
            <option value="green">Зелёный чай</option>
            <option value="oolong">Улун</option>
            <option value="flavoredBlack">Чёрный ароматизированный чай</option>
            <option value="flavoredGreen">Зелёный ароматизированный чай</option>
            <option value="fruit">Фруктовый</option>
            <option value="tisane">Тизан</option>
            <option value="puer">Пуэр</option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group d-flex justify-content-center">
          <div>
            <label for="min">Диапазон цены</label>
            <input
              type="number"
              id="min"
              v-model.number="min"
              class="form-control mx-6"
              min="1"
              placeholder="0"
            />
          </div>

          <div>
            <label for="max"></label>
            <input
              type="number"
              v-model.number="max"
              class="form-control mx-2"
              min="1"
              placeholder="1000"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container" id="card">
    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="item in filteredTea"
        :key="item._id"
      >
        <div class="card">
          <button class="add" @click="openModal(item)">
            <span class="button_top" id="button_top"> Подробнее </span>
          </button>
          <div class="card-img">
            <img :src="item.teaImage" class="card-img-top" alt="Tea Image" />
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-subtitle">{{ item.minDescription }}</p>
            <hr class="card-divider" />
            <div class="card-footer">
              <div class="card-price">{{ item.price }} <span>₽</span></div>
              <button class="card-btn" @click="addToCart(item)">
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="open">
    <div class="modal-content">
      <span class="close" @click="open = false">&times;</span>
      <div>
        <h2>{{ selectedItem.title }}</h2>
        <p>{{ selectedItem.minDescription }}</p>
        <img
          :src="selectedItem.teaImage"
          class="card-img-top"
          alt="Tea Image"
        />
        <p>{{ selectedItem.description }}</p>
        <div class="d-flex justify-content-around">
          <div class="card-price">
            <p>
              <span>Время доставки: </span>{{ selectedItem.deliveryTime
              }}<span>мин</span>
            </p>
          </div>
          <div class="card-price">{{ selectedItem.price }}<span>₽</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" v-if="openEdit">
    <div class="modal-content">
      <span class="close" @click="openEdit = false">&times;</span>
      <form @submit.prevent="changeTea">
        <h2>Редактировать чай</h2>
        <div class="form-group">
          <label for="title">Название</label>
          <input type="text" class="form-control" id="title" v-model="title" />
        </div>
        <div class="form-group">
          <label for="minDescription">Краткое описание</label>
          <input
            type="text"
            class="form-control"
            id="minDescription"
            v-model="minDescription"
          />
        </div>
        <div class="form-group">
          <label for="teaImage">Изображение</label>
          <input
            type="text"
            class="form-control"
            id="teaImage"
            v-model="teaImage"
          />
        </div>
        <div class="form-group">
          <label for="description">Полное описание</label>
          <textarea
            class="form-control"
            id="description"
            rows="3"
            v-model="description"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="teaType">Вид чая</label>
          <select
            id="teaType"
            class="form-select form-control"
            aria-label="Default select example"
            v-model="teaType"
          >
            <option value="all">Все виды</option>
            <option value="black">Чёрный чай</option>
            <option value="green">Зелёный чай</option>
            <option value="oolong">Улун</option>
            <option value="flavoredBlack">Чёрный ароматизированный чай</option>
            <option value="flavoredGreen">Зелёный ароматизированный чай</option>
            <option value="fruit">Фруктовый</option>
            <option value="tisane">Тизан</option>
            <option value="puer">Пуэр</option>
          </select>
        </div>
        <div class="form-group">
          <label for="price">Цена</label>
          <input
            type="number"
            class="form-control"
            id="price"
            v-model.number="price"
          />
        </div>
        <div class="form-group">
          <label for="deliveryTime">Время доставки</label>
          <input
            type="number"
            class="form-control"
            id="deliveryTime"
            v-model.number="deliveryTime"
          />
        </div>
        <div class="d-flex justify-content-around">
          <button type="submit" class="add">
            <span class="button_top" type="submit"> Сохранить </span>
          </button>
          <button @click.prevent="deleteTea(selectedItemEdit._id)" class="add">
            <span class="button_top"> Удалить </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
.layout {
  margin-top: 12vh;
}
.form-control {
  border-color: #000;
  box-shadow: none;
  border-width: 1px;
}

#button_top {
  display: block;
  box-sizing: border-box;
  border: 2px solid var(--button_outline_color);
  border-radius: 0.3em;
  padding: 0.3em 0.8em;
  background: var(--button_color);
  color: var(--button_outline_color);
  transform: translateY(-0.2em);
  transition: transform 0.1s ease;
  height: 2.2em;
  font-size: 0.9em;
}

.card {
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  --main-focus: #520000;
  width: 230px;
  height: 600px;
  margin-top: 3vh;
  background: var(--bg-color);
  border: 2px solid var(--main-color);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.card:hover {
  border: 2px solid var(--main-color);
  transition: all 0.2s;
}

.card-img {
  flex: 1;
}

.card-img img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  color: var(--font-color);
}

.card-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--font-color-sub);
}

.card-divider {
  width: 100%;
  border: 1px solid #460101;
  border-radius: 50px;
}

.card-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.card-price {
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color);
}

.card-price span {
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color-sub);
}

.card-btn {
  height: 35px;
  background: var(--bg-color);
  border: 2px solid var(--main-color);
  border-radius: 5px;
  padding: 0 15px;
  transition: all 0.3s;
}

.card-btn svg {
  width: 100%;
  height: 100%;
  fill: var(--main-color);
  transition: all 0.3s;
}

.card-btn:hover {
  border: 2px solid var(--main-focus);
}

.card-btn:hover svg {
  fill: var(--main-focus);
}

.card-btn:active {
  transform: translateY(3px);
}

#card,
.layout {
  padding-left: 75px;
}

@media (max-width: 576px) {
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  #card {
    padding-left: 70px;
  }
  .layout {
    padding-left: 1vh;
  }
  .row {
    flex-wrap: wrap;
    justify-content: center;
  }
  .col-12,
  .col-sm-6,
  .col-md-4,
  .col-lg-3 {
    width: 100%;
    max-width: 300px;
  }
}
@media (min-width: 577px) and (max-width: 1199px) {
  #card,
  .layout {
    padding-left: 0.6vh;
  }
}

.edit-button {
  width: 40px;
  height: 40px;
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
  text-decoration: none !important;
}

.edit-svgIcon {
  width: 17px;
  transition-duration: 0.3s;
}

.edit-svgIcon path {
  fill: white;
}

.edit-button:hover {
  width: 120px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(255, 69, 69);
  align-items: center;
}

.edit-button:hover .edit-svgIcon {
  width: 20px;
  transition-duration: 0.3s;
  transform: translateY(60%);
  -webkit-transform: rotate(360deg);
  -moz-transform: rotate(360deg);
  -o-transform: rotate(360deg);
  -ms-transform: rotate(360deg);
  transform: rotate(360deg);
}

.edit-button::before {
  display: none;
  content: "Исправить";
  color: white;
  transition-duration: 0.3s;
  font-size: 2px;
}

.edit-button:hover::before {
  display: block;
  padding-right: 10px;
  font-size: 13px;
  opacity: 1;
  transform: translateY(0px);
  transition-duration: 0.3s;
}
</style>
