<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/teams"></ion-back-button>
        </ion-buttons>
        <ion-title>Iniciar sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="Usuario" v-model="username" placeholder="tu-usuario"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Contraseña" type="password" v-model="password"></ion-input>
      </ion-item>
      <ion-text color="danger" v-if="error">
        <p>{{ error }}</p>
      </ion-text>
      <ion-button expand="block" class="ion-margin-top" @click="handleLogin">
        Iniciar sesión
      </ion-button>
      <ion-button expand="block" fill="clear" @click="router.push('/register')">
        ¿No tienes cuenta? Regístrate
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonText } from '@ionic/vue';
import { login } from '../services/auth';
import { useAuth } from '../composables/useAuth';
import { IonBackButton } from '@ionic/vue';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const { setToken } = useAuth();

async function handleLogin() {
  error.value = '';
  try {
    const { access_token } = await login(username.value, password.value);
    await setToken(access_token);
    router.push('/teams');
  } catch (err) {
    error.value = 'Usuario o contraseña incorrectos';
  }
}
</script>