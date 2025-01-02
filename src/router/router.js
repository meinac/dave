import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import NoDeco from '../pages/NoDeco.vue';
import MValues from '../pages/MValues.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/no-deco', name: 'No-Deco', component: NoDeco },
  { path: '/m-values', name: 'M Values', component: MValues },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
