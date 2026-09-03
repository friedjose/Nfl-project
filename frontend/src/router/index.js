import { createRouter, createWebHistory } from 'vue-router';
import TeamsView from '../views/TeamsView.vue';

const routes = [
  { path: '/', name: 'teams', component: TeamsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;