<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

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

    <button @click="testServer">Test Server</button>

    <!-- server response -->
    <p v-if="serverResponse">{{ serverResponse }}</p>
  </main>
</template>
