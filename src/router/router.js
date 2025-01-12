import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import MOD from '../pages/MOD.vue';
import EAD from '../pages/EAD.vue';
import NoDeco from '../pages/NoDeco.vue';
import DivePlanner from '../pages/DivePlanner.vue';
import MValues from '../pages/MValues.vue';
import Constants from '../pages/Constants.vue';
import WhyDave from '../pages/WhyDave.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/mod', name: 'MOD', component: MOD },
  { path: '/ead', name: 'EAD', component: EAD },
  { path: '/no-deco', name: 'No-Deco', component: NoDeco },
  { path: '/dive-planner', name: 'Dive Planner', component: DivePlanner },
  { path: '/m-values', name: 'M Values', component: MValues },
  { path: '/constants', name: 'Constants', component: Constants },
  { path: '/why-dave', name: 'Why Dave?', component: WhyDave },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
