<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMapStore } from "@/stores/map";

const mapStore = useMapStore();

const route = useRoute();
const router = useRouter();
const difficulty = route.query.type;
let key = difficulty as keyof typeof mapStore.maps;
const maps: Array<number[][]> = mapStore.maps[key]!;
const images = ref<string[]>([]);
const size = 3;
const color = ref("");
const title = ref<HTMLElement | null>(null);

onMounted(async () => {
  color.value = getComputedStyle(title.value!)["color"];
  drawMaps();
});

function drawMaps() {
  for (let i in maps) {
    let map = maps[i];
    let canvas = document.createElement("canvas");
    canvas.width = map[0].length * size;
    canvas.height = map.length * size;

    let ctx = canvas.getContext("2d")!;
    for (let row in map) {
      for (let col in map[row]) {
        if (map[row][col] === 1) {
          ctx.fillStyle = "#FFF";
          ctx.fillRect(parseInt(col) * size, parseInt(row) * size, size, size);
        }
      }
    }
    const image = canvas.toDataURL();

    images.value.push(image);
  }
}
</script>

<template>
  <div
    class="flex flex-col gap-8 h-screen w-screen justify-center items-center"
  >
    <h1 class="text-8xl font-bold base-content" ref="title">Map Management</h1>
    <div class="flex justify-around w-6/12">
      <template v-for="(item, index) in images">
        <div
          class="cursor-pointer"
          :style="{
            overflow: 'hidden',
          }"
          @click="router.push({ name: 'game', query: {
            type:difficulty as string,
            no:index+1
          } })"
        >
          <img
            class="relative"
            :src="item"
            :style="{
              filter: `drop-shadow(0px ${
                maps[0].length * size
              }px 0px ${color})`,
              top: `-${maps[0].length * size}px`,
            }"
          />
        </div>
      </template>
    </div>

    <button
      class="btn btn-primary"
      @click="$router.push({ name: 'difficulty' })"
    >
      Go Back
    </button>
  </div>

</template>
