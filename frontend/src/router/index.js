import { createRouter, createWebHistory } from 'vue-router';
import TeamsView from '../views/TeamsViews.vue';

const routes = [
  { path: '/', name: 'teams', component: TeamsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;