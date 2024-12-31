import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import NoDeco from '../pages/NoDeco.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/no-deco', name: 'No-Deco', component: NoDeco },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
