<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, useRouter } from "vue-router";

import Button from "primevue/button";
import Menu from "primevue/menu";
import Divider from "primevue/divider";

import { logoutUser } from "@/services/authService";

const router = useRouter();

// Sidebar collapsed state
const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

// MAIN MENU ITEMS
const menuItems = [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    command: () => router.push("/")
  },
];

// BOTTOM SETTINGS
const settingsItems = [
  {
    label: "Settings",
    icon: "pi pi-cog",
    command: () => router.push("/settings")
  },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: async () => {
      try {
        await logoutUser();
        router.push("/login");
      } catch (err) {
        console.error(err);
      }
    },
  },
];

// Hide Menu on some pages
const hideMenuOn = ['/login', '/register', '/pos', "/staff/login"]
const showMenu = computed(() => {
  return !hideMenuOn.includes(router.currentRoute.value.path)
})


</script>

<template>
  <div class="flex h-screen">

    <!-- SIDEBAR -->
    <aside :class="[
      'flex flex-col bg-zinc-50 transition-all duration-300 overflow-hidden',
      collapsed ? 'w-12' : 'w-64'
    ]" v-if="showMenu">

      <!-- Sidebar Title / App Name -->
      <div class="h-12 flex items-center px-4">
        <span :class="[
          'font-semibold whitespace-nowrap overflow-hidden transition-all',
          collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
        ]">
          POSx
        </span>
      </div>

      <!-- Collapse Sidebar Button -->
      <Button icon="pi pi-bars" class="mr-4" severity="secondary" text @click="toggleSidebar" />
      <!-- MAIN NAV MENU -->
      <div class="flex-1 px-2 pt-4">
        <Menu class="bg-zinc-400" :model="menuItems" :class="collapsed ? 'p-menu-collapsed' : ''" />
      </div>

      <!-- BOTTOM SETTINGS -->
      <div class="px-2 pb-4">
        <Divider />
        <Menu :model="settingsItems" :class="collapsed ? 'p-menu-collapsed' : ''" />
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <div class="flex flex-col flex-1">

      <!-- TOP BAR -->
      <header class="h-12 flex items-center bg-zinc-50 px-2" v-if="showMenu">
        <h1 class="text-lg font-medium m-0">Top Bar</h1>
      </header>

      <!-- ROUTER CONTENT -->
      <main class="flex-1 overflow-auto p-4 bg-zinc-50 rounded-tl-md ring-1 ring-zinc-200">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style>
/* Collapse Menu Icons Only */
.p-menu-collapsed .p-menuitem-text {
  display: none;
}

.p-menu-collapsed .p-menuitem-icon {
  margin-right: 0 !important;
}
</style>
