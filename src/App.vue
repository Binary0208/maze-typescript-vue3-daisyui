<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useMapStore } from "@/stores/map";
import ThemePicker from "./components/ThemePicker.vue";
const mapStore = useMapStore();

onMounted(async () => {
  const results = await Promise.all([
    await (await fetch("/map/maps_easy.json")).json(),
    await (await fetch("/map/maps_normal.json")).json(),
    await (await fetch("/map/maps_hard.json")).json(),
  ]);
  let key: keyof typeof mapStore.maps;
  console.log();

  let index = 0;
  for (key in mapStore.maps) {
    mapStore.maps[key] = results[index++].maps;
  }
});
</script>

<template>
  <RouterView />
  <ThemePicker/>
</template>
