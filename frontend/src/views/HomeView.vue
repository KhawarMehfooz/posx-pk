<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import Button from "primevue/button"


const serverResponse = ref("");

async function testServer() {
  try {
    const res = await axios.get("http://localhost:3000/api/hello");
    serverResponse.value = res.data;
    console.log(res.data);
  } catch (err) {
    console.error(err);
    serverResponse.value = "Error contacting server";
  }
}
</script>

<template>
  <main>
    <h1 class="text-5xl text-red-600 font-bold underline">
      Hello world!
    </h1>

    <Button label="Test Server" @click="testServer" />

    <!-- server response -->
    <p v-if="serverResponse">{{ serverResponse }}</p>
  </main>
</template>
