<script setup lang="ts">
import { Button } from "primevue";
import { ref, onErrorCaptured } from "vue";
import { useRouter } from "vue-router";

const error = ref<Error | null>(null);
const router = useRouter();

// Vue lifecycle hook — captures errors from children
onErrorCaptured((err) => {
    error.value = err as Error;
    return false;
});

function retry() {
    error.value = null;
}

function goHome() {
    router.push("/");
}
</script>

<template>
    <div v-if="error">
        <div class="error-box max-w-[500px] mt-20 m-auto p-5 border border-red-200 rounded-sm bg-red-100">
            <h2 class="text-center text-xl font-medium">Something went wrong...</h2>
            <p class="text-center text-lg">{{ error.message }}</p>

            <div class="flex items-center justify-center gap-4 mt-4">
                <Button @click="retry" size="small" severity="info" label="Retry" />
                <Button @click="goHome" size="small" severity="secondary" label="Home" />
            </div>
        </div>
    </div>

    <div v-else>
        <slot />
    </div>
</template>
