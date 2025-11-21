<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import HelloWorld from '@/components/HelloWorld.vue';

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
    <HelloWorld msg="You did it!" />

    <button @click="testServer">Test Server</button>

    <!-- server response -->
    <p v-if="serverResponse">{{ serverResponse }}</p>
  </main>
</template>
