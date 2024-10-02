<script>
import axios from "axios";
export default {
  props: ["info"],
  data() {
    return {
      info: [],
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      try {
        const response = await axios.get("/info");
        this.info = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке информации:", error);
      }
    },
  },
};
</script>

<template>
  <article>
    <section v-for="item in info" :key="item.name" class="item-section">
      <img :src="item.img" alt="Изображение {{ item.name }}" class="item-image">
      <div class="item-content">
        <h3>{{ item.name }}</h3>
        <h5>Определение:</h5>
        <p>{{ item.kinds }}</p>
        <h5>Виды:</h5>
        <p>{{ item.definition }}</p>
        <h5>Как заваривать?</h5>
        <p>{{ item.welding }}</p>
      </div>
    </section>
  </article>
</template>

<style>
article {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.item-section {
  display: flex;
  align-items: center; 
  margin-top: 10vh;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.item-image {
  max-width: 150px; 
  height: auto;
  border-radius: 8px;
  margin-right: 20px; 
}

.item-content {
  flex: 1; 
}

h3 {
  color: #333;
}

h5 {
  color: #555;
}

p {
  color: #666;
  line-height: 1.6;
}

h3, h5, p {
    text-align: left; 
}

@media (max-width: 768px) {
  .item-section {
    flex-direction: column; 
    align-items: center; 
    text-align: center; 
  }

  .item-image {
    margin-right: 0; 
    margin-bottom: 10px; 
    display: block; 
    margin-left: auto; 
    margin-right: auto; 
    max-width: 100%; 
    height: auto;
  }
}
</style>
