<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/authService";

// Form fields
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const user = await loginUser(email.value, password.value);

    if (!user?.token) {
      throw new Error("API did not return a token");
    }

    // save userData using Electron to electron store
    await window.electronAPI.saveUserData(user);

    // redirect to dashboard
    router.push("/");
  } catch (error: any) {
    errorMessage.value = error?.message ?? "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div>
        <div class="w-full border border-gray-300 py-20 px-8 sm:px-20 rounded-sm">

          <div class="text-center mb-8">
            <div class="text-3xl font-medium mb-4">POSx</div>
            <span class="text-muted-color font-medium">Login to your account</span>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="text-red-500 text-center mb-4">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin">
            <label for="email" class="block text-xl font-medium mb-2">Email</label>
            <InputText
              id="email"
              type="email"
              v-model="email"
              placeholder="email@example.com"
              class="w-full md:w-120 mb-8"
              autocomplete="off"
            />

            <label for="password" class="block font-medium text-xl mb-2">Password</label>
            <Password
              id="password"
              v-model="password"
              placeholder="******"
              :toggleMask="true"
              class="mb-4"
              fluid
              :feedback="false"
            />

            <Button
              type="submit"
              :loading="loading"
              label="Login"
              class="w-full mt-8"
            />
          </form>

        </div>
      </div>
    </div>
  </div>
</template>