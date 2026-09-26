<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/teams"></ion-back-button>
        </ion-buttons>
        <ion-title>Crear cuenta</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label="Usuario" v-model="username"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Contraseña" type="password" v-model="password"></ion-input>
      </ion-item>
      <ion-text color="danger" v-if="error">
        <p>{{ error }}</p>
      </ion-text>
      <ion-button expand="block" class="ion-margin-top" @click="handleRegister">
        Registrarme
      </ion-button>
      <ion-button expand="block" fill="clear" @click="router.push('/login')">
        ¿Ya tienes cuenta? Inicia sesión
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonText } from '@ionic/vue';
import { register } from '../services/auth';
import { IonBackButton } from '@ionic/vue';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function handleRegister() {
  error.value = '';
  try {
    await register(username.value, password.value);
    router.push('/login');
  } catch (err) {
    error.value = 'No se pudo registrar (¿el usuario ya existe?)';
  }
}
</script>