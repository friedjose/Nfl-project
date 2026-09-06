import { createRouter, createWebHistory } from 'vue-router';
import TeamsView from '../views/TeamsViews.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', name: 'teams', component: TeamsView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;