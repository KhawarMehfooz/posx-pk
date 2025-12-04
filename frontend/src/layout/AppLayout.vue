<script setup>
import { ref } from "vue";
import { RouterView, useRouter } from "vue-router";

import Button from "primevue/button";
import Menu from "primevue/menu";
import Divider from "primevue/divider";

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
  }
];
</script>

<template>
  <div class="flex h-screen">

    <!-- SIDEBAR -->
    <aside
      :class="[
        'flex flex-col bg-white border-r transition-all duration-300 overflow-hidden',
        collapsed ? 'w-16' : 'w-64'
      ]"
    >

      <!-- Sidebar Title / App Name -->
      <div class="h-14 flex items-center px-4 border-b">
        <span
          :class="[
            'font-semibold whitespace-nowrap overflow-hidden transition-all',
            collapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
          ]"
        >
          POSx
        </span>
      </div>

      <!-- MAIN NAV MENU -->
      <div class="flex-1 px-2 pt-4">
        <Menu
          :model="menuItems"
          :class="collapsed ? 'p-menu-collapsed' : ''"
        />
      </div>

      <!-- BOTTOM SETTINGS -->
      <div class="px-2 pb-4">
        <Divider />
        <Menu
          :model="settingsItems"
          :class="collapsed ? 'p-menu-collapsed' : ''"
        />
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <div class="flex flex-col flex-1">

      <!-- TOP BAR -->
      <header class="h-14 flex items-center bg-white border-b px-4">

        <!-- Collapse Sidebar Button -->
        <Button
          icon="pi pi-bars"
          class="mr-4"
          severity="secondary"
          text
          @click="toggleSidebar"
        />

        <h1 class="text-lg font-medium">Top Bar</h1>
      </header>

      <!-- ROUTER CONTENT -->
      <main class="flex-1 overflow-auto p-4 bg-gray-50">
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
