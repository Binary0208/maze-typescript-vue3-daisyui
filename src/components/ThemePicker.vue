<template>
  <div class="absolute right-4 bottom-4">
    <label class="font-bold" for="themePicker">Themes : </label>
    <select
      id="themePicker"
      v-model="currentTheme"
      class="select select-bordered"
      @change="changeTheme"
    >
      <template v-for="(item, index) in themes" :key="index">
        <option :value="item">{{ item }}</option>
      </template>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentTheme = ref(localStorage.getItem("theme") ?? "light");

onMounted(() => {
  changeTheme();
});

function changeTheme() {
  document
    .querySelector("html")
    ?.setAttribute("data-theme", currentTheme.value);
  localStorage.setItem("theme", currentTheme.value);
  if (route.name === "map") {
    nextTick(() => {
      const color=getComputedStyle(document.querySelector("h1")!)["color"]
      
      Array.from(document.querySelectorAll("img")).forEach((item) => {
        item.style.filter=item.style.filter.replace(
          /rgb\(.+\d+\)/,
          color
        );
        console.log(item.style.filter);
          
      });
    });
  }
}
const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
</script>
