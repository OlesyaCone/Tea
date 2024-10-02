import { createRouter, createWebHistory } from "vue-router";
import TeaCatalog from "./views/TeaCatalog.vue";
import Information from "./views/Information.vue";
import Edit from "./views/Edit.vue";
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "catalog",
      path: "/",
      component: TeaCatalog,
    },
    {
      name: "info",
      path: "/info",
      component: Information,
    },
    {
      name: "edit",
      path: "/edit",
      component: Edit,
    },
  ],
});
