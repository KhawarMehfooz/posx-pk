<script setup lang="ts">
</script>

<template>
    <div class="flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div>
                <div class="w-full border border-gray-300 py-20 px-8 sm:px-20  rounded-sm">
                    <div class="text-center mb-8">
                        <div class="text-3xl font-medium mb-4">POSx
                        </div>
                        <span class="text-muted-color font-medium">Login to your account</span>
                    </div>

                    <div>
                        <form>
                            <label for="email" class="block text-xl font-medium mb-2">Email</label>
                            <InputText id="email" type="email" placeholder="email@example.com"
                                class="w-full md:w-120 mb-8" autocomplete="false" />
                            <label for="password" class="block font-medium text-xl mb-2">Password</label>
                            <Password id="password" placeholder="******" :toggleMask="true" class="mb-4" fluid
                                :feedback="false"></Password>

                            <Button type="submit" label="Login" class="w-full mt-8"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>