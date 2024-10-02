<script>
export default {
  data() {
    return {
      open: false,
      title: "",
      minDescription: "",
      teaType: "black",
      teaImage: "",
      description: "",
      price: null,
      deliveryTime: null,
    };
  },
  methods: {
    addTea() {
      const tea = {
        title: this.title,
        minDescription: this.minDescription,
        teaType: this.teaType,
        teaImage: this.teaImage,
        description: this.description,
        price: parseInt(this.price),
        deliveryTime: parseInt(this.deliveryTime),
      };
      this.$emit("create", tea);
      this.title = "";
      this.minDescription = "";
      this.teaType = "";
      this.teaImage = "";
      this.description = "";
      this.price = "";
      this.image = "";
      this.deliveryTime = "";
      this.open = false;
    },
  },
};
</script>

<template>
  <button class="Btn" @click="open = true">
    <div class="sign">+</div>
    <div class="text">Добавить чай</div>
  </button>
  <div class="modal" v-if="open">
    <div class="modal-content">
      <span class="close" @click="open = false">&times;</span>
      <form @submit.prevent="addTea">
        <h2>Добавить чай</h2>

        <div class="form-group">
          <label for="teaName">Название чая</label>
          <input
            type="text"
            id="teaName"
            v-model="title"
            class="form-control"
            placeholder="Название чая"
          />
        </div>

        <div class="form-group">
          <label for="teaDescription">Краткое Описание</label>
          <textarea
            id="teaDescription"
            v-model="minDescription"
            class="form-control"
            rows="2"
            maxlength="100"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="teaImage">Добавить изображение</label>
          <input
            type="text"
            id="teaImage"
            v-model="teaImage"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="teaType">Вид</label>
          <select
            class="form-select form-control"
            aria-label="Default select example"
            v-model="teaType"
          >
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
          <label for="teaDescriptionFull">Полное описание</label>
          <textarea
            id="teaDescriptionFull"
            v-model="description"
            class="form-control"
            rows="5"
          ></textarea>
        </div>

        <div class="form-group d-flex justify-content-center">
          <div>
            <label for="teaPrice">Цена</label>
            <input
              type="number"
              id="teaPrice"
              v-model.number="price"
              class="form-control mx-6"
              placeholder="Цена чая"
              min="1"
            />
          </div>
          <div>
            <label for="teaDeliveryTime">Время доставки</label>
            <input
              type="number"
              id="teaDeliveryTime"
              v-model.number="deliveryTime"
              class="form-control mx-3"
              placeholder="Время доставки"
              min="1"
            />
          </div>
        </div>

        <button class="add" @click="addTea">
          <span class="button_top"> Добавить </span>
        </button>
      </form>
    </div>
  </div>
</template>

<style>
.Btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 0px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: black;
  position: fixed;
  bottom: 3vh;
  left: 1vh;
  z-index: 1000;
}

.sign {
  width: 100%;
  font-size: 2em;
  color: white;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 500;
  transition-duration: 0.3s;
}

.Btn:hover {
  width: 125px;
  border-radius: 0px;
  transition-duration: 0.3s;
}

.Btn:hover .sign {
  width: 30%;
  transition-duration: 0.3s;
}

.Btn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.3s;
  padding-right: 5px;
  padding-left: 5px;
}

.Btn:active {
  transform: translate(2px, 2px);
}

.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  justify-content: center;
  align-items: center;
  display: flex;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  position: relative;
  border-radius: 8px;
  text-align: center;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 1px;
  right: 10px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-control {
  border-color: #000;
  box-shadow: none;
  border-width: 0.5px;
}

.form-control:focus {
  border-color: #000;
  box-shadow: none;
  border-width: 2px;
}
.form-group {
  margin-bottom: 20px;
}

.add {
  --button_radius: 0.75em;
  --button_color: white;
  --button_outline_color: #000000;
  font-size: 17px;
  font-weight: bold;
  border: none;
  border-radius: var(--button_radius);
  background: var(--button_outline_color);
}

.button_top {
  display: block;
  box-sizing: border-box;
  border: 2px solid var(--button_outline_color);
  border-radius: var(--button_radius);
  padding: 0.75em 1.5em;
  background: var(--button_color);
  color: var(--button_outline_color);
  transform: translateY(-0.2em);
  transition: transform 0.1s ease;
}

.add:hover .button_top {
  transform: translateY(-0.33em);
}

.add:active .button_top {
  transform: translateY(0);
}
</style>
